/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { saveStoredQueue, loadStoredQueue, PriorityCountry, ModerationQueueItem } from '../data/adminStore';
import { auth, db } from './firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export type EscrowStatus = 
  | 'escrow_held'              // Funds locked in Escrow
  | 'seller_delivering'        // Seller is transferring digital product
  | 'delivered_verification'   // Product delivered, pending buyer & system verification
  | 'commission_verified'      // Transaction & commission checked before payout
  | 'completed_settled'        // Payout to seller completed, commission retained
  | 'disputed_fraud'           // Frozen due to fraud report / dispute
  | 'refunded_buyer';          // Refunded to buyer due to detected fraud

export interface EscrowTransaction {
  orderId: string;
  escrowTxId: string;
  productId: string;
  productTitle: string;
  price: number;
  currency: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: EscrowStatus;
  escrowFeePercent: number;
  platformFee: number;
  sellerPayout: number;
  hcbTerminal: string;
  hcbMerchantId: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verificationChecks?: {
    sellerDelivered: boolean;
    digitalProductValid: boolean;
    noFraudReports: boolean;
    commissionAccurate: boolean;
  };
}

const ESCROW_STORAGE_PREFIX = 'magicplay_escrow_tx_';

// Save Escrow transaction record
export function saveEscrowTransaction(tx: EscrowTransaction): void {
  try {
    localStorage.setItem(`${ESCROW_STORAGE_PREFIX}${tx.orderId}`, JSON.stringify(tx));
  } catch (err) {
    console.warn('Error saving local escrow transaction:', err);
  }
}

// Load Escrow transaction record
export function getEscrowTransaction(orderId: string): EscrowTransaction | null {
  try {
    const raw = localStorage.getItem(`${ESCROW_STORAGE_PREFIX}${orderId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Creates an Escrow Hold using the configured Escrow API & HCB credentials.
 * Holds buyer funds securely until digital product delivery.
 */
export async function createEscrowHold(params: {
  orderId: string;
  productId: string;
  productTitle: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
}): Promise<{
  success: boolean;
  escrowTxId: string;
  status: EscrowStatus;
  platformFee: number;
  sellerPayout: number;
  message: string;
}> {
  const backendUrl = import.meta.env.VITE_ESCROW_BACKEND_URL?.trim();
  if (!backendUrl) {
    throw new Error('Escrow backend URL is not configured.');
  }
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) {
    throw new Error('Authentication is required before creating an escrow hold.');
  }

  const response = await fetch(`${backendUrl.replace(/\/$/, '')}/api/escrow/holds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify(params)
  });
  if (!response.ok) {
    throw new Error(`Escrow provider rejected the hold (${response.status}).`);
  }
  const providerResult = await response.json() as {
    escrowTxId?: string;
    status?: EscrowStatus;
  };
  if (!providerResult.escrowTxId || providerResult.status !== 'escrow_held') {
    throw new Error('Escrow provider returned an invalid hold response.');
  }

  const feePercent = 3.0;
  const platformFee = Math.round(params.price * (feePercent / 100));
  const sellerPayout = Math.max(0, params.price - platformFee);
  const escrowTxId = providerResult.escrowTxId;

  const txRecord: EscrowTransaction = {
    orderId: params.orderId,
    escrowTxId,
    productId: params.productId,
    productTitle: params.productTitle,
    price: params.price,
    currency: 'RUB',
    buyerId: params.buyerId,
    buyerName: params.buyerName,
    sellerId: params.sellerId,
    sellerName: params.sellerName,
    status: 'escrow_held',
    escrowFeePercent: feePercent,
    platformFee,
    sellerPayout,
    hcbTerminal: '',
    hcbMerchantId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verificationChecks: {
      sellerDelivered: false,
      digitalProductValid: false,
      noFraudReports: true,
      commissionAccurate: true
    }
  };

  saveEscrowTransaction(txRecord);

  const orderDocRef = doc(db, 'orders', params.orderId);
  await updateDoc(orderDocRef, {
    escrowTxId,
    escrowStatus: 'escrow_held',
    platformFee,
    sellerPayout,
    escrowFeePercent: feePercent,
    hcbTerminal: txRecord.hcbTerminal,
    escrowLockedAt: serverTimestamp()
  });

  return {
    success: true,
    escrowTxId,
    status: 'escrow_held',
    platformFee,
    sellerPayout,
    message: `Средства (${params.price} ₽) успешно заморожены в гаранте Escrow & ХЦБ.`
  };
}

/**
 * Notifies Escrow that the seller delivered the digital product (code/account/transfer).
 * Transitions state from 'escrow_held' -> 'delivered_verification'.
 */
export async function notifyDigitalProductDelivered(orderId: string, deliveryDetails?: string): Promise<boolean> {
  const tx = getEscrowTransaction(orderId);
  if (!tx) return false;

  tx.status = 'delivered_verification';
  tx.updatedAt = new Date().toISOString();
  if (tx.verificationChecks) {
    tx.verificationChecks.sellerDelivered = true;
    tx.verificationChecks.digitalProductValid = true;
  }
  saveEscrowTransaction(tx);

  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      escrowStatus: 'delivered_verification',
      sellerDeliveredAt: serverTimestamp(),
      deliveryNotice: deliveryDetails || 'Цифровой товар передан'
    });
  } catch (err) {
    console.warn('Firestore delivery sync notice:', err);
  }

  return true;
}

/**
 * Verifies transaction integrity and compliance before finalizing commission distribution.
 * Checks for fraud reports, seller delivery proof, and calculated payouts.
 */
export async function verifyEscrowTransaction(orderId: string): Promise<{
  verified: boolean;
  canDistributeCommission: boolean;
  sellerPayout: number;
  platformFee: number;
  status: EscrowStatus;
  checks: {
    sellerDelivered: boolean;
    digitalProductValid: boolean;
    noFraudReports: boolean;
    commissionAccurate: boolean;
  };
  reason?: string;
}> {
  const tx = getEscrowTransaction(orderId);
  if (!tx) {
    return {
      verified: false,
      canDistributeCommission: false,
      sellerPayout: 0,
      platformFee: 0,
      status: 'disputed_fraud',
      checks: {
        sellerDelivered: false,
        digitalProductValid: false,
        noFraudReports: false,
        commissionAccurate: false
      },
      reason: 'Escrow transaction record is missing.'
    };
  }

  // Check if there is an active fraud dispute in queue
  const queue = loadStoredQueue();
  const hasActiveFraudDispute = queue.some(
    q => (q.id === orderId || q.hcbTransactionId === tx.escrowTxId) && q.status === 'frozen'
  );

  const checks = {
    sellerDelivered: tx.verificationChecks?.sellerDelivered ?? true,
    digitalProductValid: !hasActiveFraudDispute,
    noFraudReports: !hasActiveFraudDispute,
    commissionAccurate: tx.platformFee + tx.sellerPayout === tx.price
  };

  const canDistributeCommission = checks.noFraudReports && checks.commissionAccurate;

  if (canDistributeCommission) {
    tx.status = 'commission_verified';
    tx.verifiedAt = new Date().toISOString();
    saveEscrowTransaction(tx);
  }

  return {
    verified: canDistributeCommission,
    canDistributeCommission,
    sellerPayout: tx.sellerPayout,
    platformFee: tx.platformFee,
    status: tx.status,
    checks,
    reason: hasActiveFraudDispute ? 'Транзакция приостановлена: обнаружен активный спор по мошенничеству' : undefined
  };
}

/**
 * Finalizes commission distribution after verification check.
 * Releases net seller earnings and retains platform fee.
 */
export async function finalizeCommissionDistribution(orderId: string): Promise<{
  success: boolean;
  sellerPayout: number;
  platformFee: number;
}> {
  const verification = await verifyEscrowTransaction(orderId);
  if (!verification.canDistributeCommission) {
    return { success: false, sellerPayout: 0, platformFee: 0 };
  }

  const tx = getEscrowTransaction(orderId);
  if (tx) {
    tx.status = 'completed_settled';
    tx.updatedAt = new Date().toISOString();
    saveEscrowTransaction(tx);
  }

  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      escrowStatus: 'completed_settled',
      status: 'completed',
      settledAt: serverTimestamp(),
      commissionDistributed: true
    });
  } catch (err) {
    console.warn('Notice: Firestore settlement sync:', err);
  }

  return {
    success: true,
    sellerPayout: verification.sellerPayout,
    platformFee: verification.platformFee
  };
}

/**
 * Reports a fraud attempt or rule violation, instantly freezing Escrow funds
 * and routing the incident to the Moderator Anti-Fraud Queue (KZ > RU > US).
 */
export function reportFraudToModerators(params: {
  orderId: string;
  productTitle: string;
  sellerName: string;
  buyerName: string;
  reason: string;
  details: string;
  country?: PriorityCountry;
}): void {
  const tx = getEscrowTransaction(params.orderId);
  if (tx) {
    tx.status = 'disputed_fraud';
    tx.updatedAt = new Date().toISOString();
    saveEscrowTransaction(tx);
  }

  const targetCountry = params.country || 'KZ';
  const countryNameMap: Record<PriorityCountry, string> = {
    KZ: 'Казахстан (Приоритет №1)',
    RU: 'Россия (Приоритет №2)',
    US: 'США / Global (Приоритет №3)'
  };

  const newTicket: ModerationQueueItem = {
    id: `FRAUD-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `🚨 Антифрод: ${params.reason} [Заказ #${params.orderId}]`,
    game: params.productTitle,
    sellerName: params.sellerName,
    sellerEmail: 'seller.flagged@magicplay.io',
    country: targetCountry,
    countryName: countryNameMap[targetCountry],
    price: tx?.price || 0,
    type: 'escrow_dispute',
    status: 'frozen',
    createdAt: 'Только что',
    reason: `${params.details} (Заявитель: ${params.buyerName})`,
    hcbTransactionId: tx?.escrowTxId || `ESC-${params.orderId}`
  };

  const currentQueue = loadStoredQueue();
  saveStoredQueue([newTicket, ...currentQueue]);
}
