import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  idToken: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, username: string) => Promise<void>;
  loginAsDemoUser: (userType: 'alex' | 'elena' | 'liam') => void;
  signOut: () => Promise<void>;
  dbSynced: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbSynced, setDbSynced] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalMode('signup');
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          
          // Sync user profile with server backend
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              displayName: user.displayName,
              username: user.email?.split('@')[0] || `user_${user.uid.slice(0, 5)}`,
              avatar: user.photoURL,
            }),
          });
          if (res.ok) {
            setDbSynced(true);
          }
        } catch (err) {
          console.error('Failed to retrieve token or sync profile:', err);
        }
      } else {
        setIdToken(null);
        setDbSynced(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await signInWithPopup(auth, googleAuthProvider);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      setAuthError(error.message || 'Google sign-in failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email sign-in failed:', error);
      const msg = error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
        ? 'Invalid email or password. If you do not have an account, click "Create Account".'
        : error.message || 'Failed to sign in. Please verify your credentials.';
      setAuthError(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string, username: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName,
          photoURL: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`
        });
      }
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Sign-up failed:', error);
      const msg = error.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Please log in instead.'
        : error.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : error.message || 'Failed to create account.';
      setAuthError(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = (userType: 'alex' | 'elena' | 'liam') => {
    const demos = {
      alex: {
        uid: 'demo_alex',
        displayName: 'Alex Solaris',
        email: 'alex.solaris@gengram.io',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      elena: {
        uid: 'demo_elena',
        displayName: 'Elena Rostova',
        email: 'elena.rostova@gengram.io',
        photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80'
      },
      liam: {
        uid: 'demo_liam',
        displayName: 'Liam Vance',
        email: 'liam.vance@gengram.io',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      }
    };
    
    const chosen = demos[userType];
    // Create a mock FirebaseUser-like object
    const mockUser = {
      uid: chosen.uid,
      displayName: chosen.displayName,
      email: chosen.email,
      photoURL: chosen.photoURL,
      getIdToken: async () => 'demo_token_' + chosen.uid,
    } as unknown as FirebaseUser;

    setFirebaseUser(mockUser);
    setIdToken('demo_token_' + chosen.uid);
    setDbSynced(true);
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      setIdToken(null);
      setFirebaseUser(null);
      setDbSynced(false);
    } catch (error) {
      console.error('Sign out error:', error);
      setIdToken(null);
      setFirebaseUser(null);
      setDbSynced(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        idToken,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        loginAsDemoUser,
        signOut,
        dbSynced,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openSignUpModal,
        authError,
        clearAuthError,
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

