import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { UserProfile, Role } from '../lib/firebase/firestore/types';

interface AuthContextType {
  user: (FirebaseUser & Partial<UserProfile>) | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(FirebaseUser & Partial<UserProfile>) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data() as UserProfile | undefined;
          
          // Set user session in localStorage
          localStorage.setItem('userSession', JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            lastLogin: new Date().toISOString()
          }));
          
          setUser({
            ...firebaseUser,
            ...userData,
          });
        } else {
          setUser(null);
          localStorage.removeItem('userSession');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    });

    // Check for existing session on mount
    const existingSession = localStorage.getItem('userSession');
    if (existingSession) {
      setLoading(true);
    }

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLoginAt: Timestamp.now()
      }, { merge: true });

    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: Role) => {
    try {
      setError(null);
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName || email.split('@')[0],
        role,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Failed to create account');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      localStorage.removeItem('userSession');
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          ...data,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      // Update local user state
      setUser((prev) => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
      throw err;
    }
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
