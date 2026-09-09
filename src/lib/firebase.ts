import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
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

// Initialize Analytics if supported
export let analytics: any = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported().then(supported => {
    if (supported) analytics = getAnalytics(app);
  }).catch(() => {});
}

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore (default database in user's personal project)
export const db: Firestore = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const PLATFORM_OWNER_EMAIL = 'random11234500@gmail.com';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  balance: number;
  rating?: number;
  salesCount?: number;
  role?: 'owner' | 'admin' | 'moderator' | 'user';
  isOwner?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
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

    const isOwnerUser = user.email?.toLowerCase().trim() === PLATFORM_OWNER_EMAIL.toLowerCase();

    let profile: UserProfile;

    if (!snap.exists()) {
      profile = {
        uid: user.uid,
        displayName: user.displayName || (isOwnerUser ? 'Владелец MagicPlay' : 'Пользователь MagicPlay'),
        email: user.email || '',
        photoURL: user.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        balance: 0,
        rating: isOwnerUser ? 5.0 : 0,
        salesCount: isOwnerUser ? 100 : 0,
        role: isOwnerUser ? 'owner' : 'user',
        isOwner: isOwnerUser,
        isAdmin: isOwnerUser,
        permissions: isOwnerUser 
          ? ['ALL', 'FIRESTORE_BASE_OWNER', 'ADMIN_PANEL', 'MODERATOR_PANEL', 'ESCROW_OVERRIDE'] 
          : ['USER'],
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, profile);
    } else {
      const data = snap.data() as UserProfile;
      profile = {
        ...data,
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        email: user.email || data.email,
        role: isOwnerUser ? 'owner' : (data.role || 'user'),
        isOwner: isOwnerUser || !!data.isOwner,
        isAdmin: isOwnerUser || !!data.isAdmin,
        permissions: isOwnerUser 
          ? ['ALL', 'FIRESTORE_BASE_OWNER', 'ADMIN_PANEL', 'MODERATOR_PANEL', 'ESCROW_OVERRIDE'] 
          : (data.permissions || ['USER'])
      };
      // Keep basic info updated
      await updateDoc(userRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        email: profile.email,
        role: profile.role,
        isOwner: profile.isOwner,
        isAdmin: profile.isAdmin,
        permissions: profile.permissions
      });
    }

    // Persist owner record in Firestore collections `admins` and `settings/platform_owner`
    if (isOwnerUser) {
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: profile.displayName,
          role: 'owner',
          isOwner: true,
          grantedAt: serverTimestamp(),
          databaseId: firebaseConfig.firestoreDatabaseId || 'default'
        }, { merge: true });

        await setDoc(doc(db, 'settings', 'platform_owner'), {
          ownerEmail: user.email,
          ownerUid: user.uid,
          ownerName: profile.displayName,
          role: 'owner',
          isOwner: true,
          database: firebaseConfig.projectId || 'magicplay-524d5',
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Owner base document sync notice:', err);
      }
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
