import { User } from 'firebase/auth';

export interface AuthUser extends User {
  role?: 'admin' | 'representative' | 'staff';
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAuthReturn extends AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}
