import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  Firestore,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore
export const db: Firestore = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  balance: number;
  rating?: number;
  salesCount?: number;
  createdAt?: any;
}

// Sign in with Google Popup
export async function loginWithGoogle(): Promise<UserProfile | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check or create profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    let profile: UserProfile;

    if (!snap.exists()) {
      profile = {
        uid: user.uid,
        displayName: user.displayName || 'Пользователь MagicPlay',
        email: user.email || '',
        photoURL: user.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        balance: 0,
        rating: 0,
        salesCount: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, profile);
    } else {
      const data = snap.data() as UserProfile;
      profile = {
        ...data,
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        email: user.email || data.email
      };
      // Keep basic info updated
      await updateDoc(userRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        email: profile.email
      });
    }

    return profile;
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      // Normal cancellation: user closed the Google authentication window
      return null;
    }
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign out
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Update user balance in Firestore
export async function updateUserBalance(uid: string, newBalance: number): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { balance: newBalance });
  } catch (e) {
    console.error('Error updating balance:', e);
  }
}

export { fbOnAuthStateChanged };
