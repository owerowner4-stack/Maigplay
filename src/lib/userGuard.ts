import { Product, Seller } from '../types';
import { UserProfile } from './firebase';

/**
 * Anti-fool protection: prevents buyer from purchasing their own item (self-purchase)
 */
export function isUserOwnProduct(product: Product | null, user: UserProfile | null): boolean {
  if (!product || !user) return false;
  
  const sellerId = product.seller.id;
  if (sellerId === user.uid || sellerId === 'me') {
    return true;
  }
  
  if (user.displayName && product.seller.name && 
      product.seller.name.trim().toLowerCase() === user.displayName.trim().toLowerCase()) {
    return true;
  }

  const sellerAny = product.seller as any;
  if (user.email && sellerAny.email && sellerAny.email === user.email) {
    return true;
  }

  return false;
}

export interface AffordabilityStatus {
  canAfford: boolean;
  balance: number;
  shortage: number;
  isZeroBalance: boolean;
}

/**
 * Check if user balance is sufficient or if balance is 0
 */
export function checkAffordability(productPrice: number, balance: number): AffordabilityStatus {
  const current = Math.max(0, balance || 0);
  const shortage = Math.max(0, productPrice - current);
  const isZeroBalance = current <= 0;
  const canAfford = current >= productPrice;

  return {
    canAfford,
    balance: current,
    shortage,
    isZeroBalance
  };
}
