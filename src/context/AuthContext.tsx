import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  UserProfile, 
  updateUserBalance,
  fbOnAuthStateChanged,
  PLATFORM_OWNER_EMAIL
} from '../lib/firebase';
import { signInWithPopup, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  topupBalance: (amount: number) => Promise<void>;
  deductBalance: (amount: number) => Promise<boolean>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  creditEarnings: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribeAuth = fbOnAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);

        // Real-time listener on user profile document in Firestore
        const unsubscribeDoc = onSnapshot(userDocRef, async (snap) => {
          const isOwnerUser = fbUser.email?.toLowerCase().trim() === PLATFORM_OWNER_EMAIL.toLowerCase();

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const updatedProfile: UserProfile = {
              ...data,
              role: isOwnerUser ? 'owner' : (data.role || 'user'),
              isOwner: isOwnerUser || !!data.isOwner,
              isAdmin: isOwnerUser || !!data.isAdmin,
              permissions: isOwnerUser 
                ? ['ALL', 'FIRESTORE_BASE_OWNER', 'ADMIN_PANEL', 'MODERATOR_PANEL', 'ESCROW_OVERRIDE'] 
                : (data.permissions || ['USER'])
            };
            setUser(updatedProfile);

            // If user is owner but profile in DB was not marked yet, update DB doc
            if (isOwnerUser && (!data.isOwner || data.role !== 'owner')) {
              try {
                await updateDoc(userDocRef, {
                  role: 'owner',
                  isOwner: true,
                  isAdmin: true,
                  permissions: ['ALL', 'FIRESTORE_BASE_OWNER', 'ADMIN_PANEL', 'MODERATOR_PANEL', 'ESCROW_OVERRIDE']
                });
                await setDoc(doc(db, 'admins', fbUser.uid), {
                  uid: fbUser.uid,
                  email: fbUser.email,
                  role: 'owner',
                  isOwner: true,
                  grantedAt: serverTimestamp()
                }, { merge: true });
                await setDoc(doc(db, 'settings', 'platform_owner'), {
                  ownerEmail: fbUser.email,
                  ownerUid: fbUser.uid,
                  role: 'owner',
                  isOwner: true,
                  database: 'magicplay-524d5',
                  updatedAt: serverTimestamp()
                }, { merge: true });
              } catch (e) {
                console.warn('Owner status sync warning:', e);
              }
            }
          } else {
            // Document doesn't exist yet, create it
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              displayName: fbUser.displayName || (isOwnerUser ? 'Владелец MagicPlay' : 'Геймер MagicPlay'),
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
              balance: 0, // Стартовый баланс 0 ₽ при регистрации
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
            try {
              await setDoc(userDocRef, newProfile);
              if (isOwnerUser) {
                await setDoc(doc(db, 'admins', fbUser.uid), {
                  uid: fbUser.uid,
                  email: fbUser.email,
                  role: 'owner',
                  isOwner: true,
                  grantedAt: serverTimestamp()
                }, { merge: true });
                await setDoc(doc(db, 'settings', 'platform_owner'), {
                  ownerEmail: fbUser.email,
                  ownerUid: fbUser.uid,
                  role: 'owner',
                  isOwner: true,
                  database: 'magicplay-524d5',
                  updatedAt: serverTimestamp()
                }, { merge: true });
              }
            } catch (err) {
              console.warn('Profile write deferred in offline mode:', err);
            }
            setUser(newProfile);
          }
          setLoading(false);
        }, (err: any) => {
          if (err?.code === 'unavailable') {
            console.warn('Profile sync operating in offline mode.');
            const isOwnerUser = fbUser.email?.toLowerCase().trim() === PLATFORM_OWNER_EMAIL.toLowerCase();
            // Provide offline user fallback so user can still see their session
            setUser((prev) => prev || {
              uid: fbUser.uid,
              displayName: fbUser.displayName || (isOwnerUser ? 'Владелец MagicPlay' : 'Геймер MagicPlay'),
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              balance: 0,
              rating: isOwnerUser ? 5.0 : 0,
              salesCount: isOwnerUser ? 100 : 0,
              role: isOwnerUser ? 'owner' : 'user',
              isOwner: isOwnerUser,
              isAdmin: isOwnerUser
            });
          } else {
            console.warn('Snapshot notice for user profile:', err?.message || err);
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        // Not logged in or guest
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLoginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);

      let profile: UserProfile;
      if (!snap.exists()) {
        profile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Геймер MagicPlay',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          balance: 0,
          rating: 0,
          salesCount: 0,
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, profile);
      } else {
        const data = snap.data() as UserProfile;
        profile = {
          ...data,
          displayName: fbUser.displayName || data.displayName,
          photoURL: fbUser.photoURL || data.photoURL,
          email: fbUser.email || data.email
        };
        await updateDoc(userDocRef, {
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          email: profile.email
        });
      }

      setUser(profile);
      return profile;
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.message?.includes('popup-closed-by-user')
      ) {
        // User closed or cancelled the popup window. This is normal user behavior, not an error.
        return null;
      }
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const handleTopupBalance = async (amount: number) => {
    if (!user) return;
    const newBal = (user.balance || 0) + amount;
    await updateUserBalance(user.uid, newBal);
    setUser((prev) => prev ? { ...prev, balance: newBal } : null);
  };

  const handleDeductBalance = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    const currentBal = user.balance || 0;
    if (currentBal < amount) return false;
    const newBal = currentBal - amount;
    await updateUserBalance(user.uid, newBal);
    setUser((prev) => prev ? { ...prev, balance: newBal } : null);
    return true;
  };

  const handleWithdrawBalance = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    const currentBal = user.balance || 0;
    if (currentBal < amount) return false;
    const newBal = currentBal - amount;
    await updateUserBalance(user.uid, newBal);
    setUser((prev) => prev ? { ...prev, balance: newBal } : null);
    return true;
  };

  const handleCreditEarnings = async (amount: number) => {
    if (!user) return;
    const newBal = (user.balance || 0) + amount;
    await updateUserBalance(user.uid, newBal);
    setUser((prev) => prev ? { ...prev, balance: newBal } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithGoogle: handleLoginWithGoogle,
        logout: handleLogout,
        topupBalance: handleTopupBalance,
        deductBalance: handleDeductBalance,
        withdrawBalance: handleWithdrawBalance,
        creditEarnings: handleCreditEarnings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
