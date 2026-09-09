import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ChatMessage } from '../types';
import { PRODUCTS } from '../data/mockData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

export interface OrderDoc {
  id: string;
  productId: string;
  productTitle: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  price: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  status: 'pending_payment' | 'paid' | 'transferring' | 'checking' | 'completed' | 'disputed';
  createdAt: any;
  updatedAt?: any;
}

// Seed initial products to Firestore if empty
export async function initProductsCollection(): Promise<void> {
  try {
    const collRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(collRef);
    if (snap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), {
          ...prod,
          createdAt: serverTimestamp()
        }, { merge: true });
      }
    }
  } catch (error) {
    console.warn('Products collection initialization notice (using default catalog):', error);
  }
}

// Subscribe to real-time products with resilient offline handling
export function subscribeToProducts(callback: (products: Product[]) => void) {
  try {
    const collRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(collRef, (snapshot) => {
      if (snapshot.empty) {
        callback(PRODUCTS);
      } else {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            title: data.title,
            gameId: data.gameId,
            gameName: data.gameName,
            gameIcon: data.gameIcon,
            category: data.category,
            platform: data.platform,
            price: data.price,
            instantDelivery: data.instantDelivery,
            seller: data.seller,
            description: data.description,
            tags: data.tags || [],
            inStock: data.inStock || 1,
            guaranteeHours: data.guaranteeHours || 48
          });
        });
        callback(items);
      }
    }, (err: any) => {
      if (err?.code === 'unavailable') {
        console.warn('Firestore products stream in offline mode (using catalog cache).');
      } else {
        console.warn('Firestore products subscription notice:', err?.message || err);
      }
      callback(PRODUCTS);
    });
  } catch (e) {
    console.warn('Could not initialize products snapshot, falling back to static catalog:', e);
    callback(PRODUCTS);
    return () => {};
  }
}

// Add a new product to Firestore
export async function createProductInFirestore(product: Omit<Product, 'id'> & { id?: string }): Promise<string> {
  const collRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(collRef, {
    ...product,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Create an Escrow order in Firestore
export async function createOrderInFirestore(orderData: {
  product: Product;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
}): Promise<string> {
  const orderId = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);

  const newOrder: OrderDoc = {
    id: orderId,
    productId: orderData.product.id,
    productTitle: orderData.product.title,
    gameId: orderData.product.gameId,
    gameName: orderData.product.gameName,
    gameIcon: orderData.product.gameIcon,
    price: orderData.product.price,
    buyerId: orderData.buyerId,
    buyerName: orderData.buyerName,
    buyerAvatar: orderData.buyerAvatar,
    sellerId: orderData.product.seller.id,
    sellerName: orderData.product.seller.name,
    sellerAvatar: orderData.product.seller.avatar,
    status: 'pending_payment' as OrderDoc['status'],
    createdAt: serverTimestamp()
  };

  await setDoc(orderRef, newOrder);

  return orderId;
}

// Subscribe to messages in an order
export function subscribeToOrderMessages(orderId: string, callback: (msgs: ChatMessage[]) => void) {
  try {
    const messagesRef = collection(db, ORDERS_COLLECTION, orderId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        msgs.push({
          id: d.id,
          sender: data.sender,
          text: data.text,
          timestamp: data.timestamp || 'только что',
          isSystemNotice: !!data.isSystemNotice
        });
      });
      callback(msgs);
    }, (err: any) => {
      if (err?.code === 'unavailable') {
        console.warn('Firestore messages stream in offline mode.');
      } else {
        console.warn('Error fetching order messages:', err?.message || err);
      }
    });
  } catch (e) {
    console.warn('Could not initialize order messages snapshot:', e);
    return () => {};
  }
}

// Send a message in an order
export async function sendOrderMessage(orderId: string, message: {
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  timestamp?: string;
  isSystemNotice?: boolean;
}) {
  const messagesRef = collection(db, ORDERS_COLLECTION, orderId, 'messages');
  await addDoc(messagesRef, {
    ...message,
    timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: serverTimestamp()
  });
}

// Delete a product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(productRef);
}

// Update product in Firestore (e.g. price, description, inStock)
export async function updateProductInFirestore(productId: string, updates: Partial<Product>): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, updates);
}

// Update order status (e.g. 'completed')
export async function updateOrderStatus(orderId: string, status: OrderDoc['status']) {
if (status === 'completed') {
  throw new Error('Order settlement must be performed by the escrow server.');
}
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

// Subscribe to user's orders
export function subscribeToUserOrders(userId: string, callback: (orders: OrderDoc[]) => void) {
  try {
    const collRef = collection(db, ORDERS_COLLECTION);
    const q = query(collRef, where('buyerId', '==', userId));

    return onSnapshot(q, (snapshot) => {
      const list: OrderDoc[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as OrderDoc);
      });
      callback(list);
    }, (err: any) => {
      if (err?.code === 'unavailable') {
        console.warn('Firestore orders sync operating in offline mode.');
      } else {
        console.warn('Error fetching user orders:', err?.message || err);
      }
      callback([]);
    });
  } catch (e) {
    console.warn('Could not initialize user orders snapshot:', e);
    callback([]);
    return () => {};
  }
}
