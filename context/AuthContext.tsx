'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
  Suspense,
} from 'react';
import { useConvex, useMutation, useQuery } from 'convex/react'; // Static imports
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { Role } from '../lib/types/roles';
import LogoutConfirmationDialog from '../components/LogoutConfirmationDialog';
import { ConvexSafeComponent } from '../components/ConvexErrorBoundary';

interface UserProfile {
  _id: Id<"users">;
  email: string;
  role: string;
  name: string;
  displayname?: string;
  lastLoginAt?: number;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, any>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string, role?: Role) => Promise<void>;
  signUp: (email: string, password: string, role: Role, metadata?: Record<string, any>) => Promise<void>;
  logout: (forceRedirect?: boolean) => Promise<void>;
  confirmLogout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  convexAvailable: boolean;
  showLogoutConfirmation: boolean;
  setShowLogoutConfirmation: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const convex = useConvex(); // Top-level hook
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [convexAvailable, setConvexAvailable] = useState(false);

  const isBrowser = typeof window !== 'undefined';

  // Convex hooks at top level
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.registerUser); // Changed to registerUser to match auth.ts
  const logoutMutation = useMutation(api.auth.logout);
  const updateProfileMutation = useMutation(api.auth.updateUser); // Changed to updateUser to match auth.ts
  const currentUser = useQuery(api.auth.getCurrentUser, sessionToken ? { token: sessionToken } : skip());

  // Initialize mounted state and check for token
  useEffect(() => {
    if (!isBrowser) return;

    setMounted(true);
    const token = localStorage.getItem('sessionToken');
    if (token) {
      setSessionToken(token);
    } else {
      setLoading(false);
    }
  }, [isBrowser]);

  // Check Convex availability
  useEffect(() => {
    if (!isBrowser || !mounted) return;

    if (convex) {
      console.log('Convex client detected in AuthContext');
      setConvexAvailable(true);
    } else {
      console.warn('Convex client not available');
      setConvexAvailable(false);
      setLoading(false);
    }
  }, [isBrowser, mounted, convex]);

  // Sync user state with query result
  useEffect(() => {
    if (!convexAvailable || !mounted) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (currentUser === undefined) return; // Still loading

    if (currentUser === null) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [currentUser, convexAvailable, mounted]);

  const logout = useCallback(
    async (forceRedirect: boolean = false) => {
      if (forceRedirect) {
        localStorage.removeItem('sessionToken');
        setSessionToken(null);
        setUser(null);
        return;
      }
      setShowLogoutConfirmation(true);
    },
    []
  );

  const confirmLogout = useCallback(async () => {
    try {
      setLoading(true);
      if (convexAvailable && logoutMutation && sessionToken) {
        await logoutMutation({ token: sessionToken });
      }
      localStorage.removeItem('sessionToken');
      setSessionToken(null);
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      localStorage.removeItem('sessionToken');
      setSessionToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      setShowLogoutConfirmation(false);
    }
  }, [logoutMutation, sessionToken, convexAvailable]);

  const signIn = useCallback(
    async (email: string, password: string, role?: Role) => {
      if (!convexAvailable) {
        setError('Authentication service unavailable');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await login({ email, password }); // No role arg in auth.ts login
        if (result?.token) {
          localStorage.setItem('sessionToken', result.token);
          setSessionToken(result.token);
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (err: any) {
        console.error('Login error:', err);
        setError(err.message || 'Failed to sign in');
      } finally {
        setLoading(false);
      }
    },
    [login, convexAvailable]
  );

  const signUp = useCallback(
    async (email: string, password: string, role: Role, metadata?: Record<string, any>) => {
      if (!convexAvailable) {
        setError('Registration service unavailable');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await register({ email, password, role, metadata });
        if (result?.token) {
          localStorage.setItem('sessionToken', result.token);
          setSessionToken(result.token);
        } else {
          throw new Error('Registration failed');
        }
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(err.message || 'Failed to sign up');
      } finally {
        setLoading(false);
      }
    },
    [register, convexAvailable]
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!convexAvailable || !updateProfileMutation || !user) {
        setError('Profile update service unavailable');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        await updateProfileMutation({ userId: user._id, ...data }); // Adjusted to match auth.ts
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      } catch (err: any) {
        console.error('Profile update error:', err);
        setError(err.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
    [updateProfileMutation, user, convexAvailable]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signIn,
      signUp,
      logout,
      confirmLogout,
      updateProfile,
      convexAvailable,
      showLogoutConfirmation,
      setShowLogoutConfirmation,
    }),
    [user, loading, error, signIn, signUp, logout, confirmLogout, updateProfile, convexAvailable, showLogoutConfirmation]
  );

  return (
    <AuthContext.Provider value={value}>
      {showLogoutConfirmation && (
        <LogoutConfirmationDialog
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirmation(false)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
}

class ErrorBoundary extends React.Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error in AuthProviderContent:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authErrorFallback = (
    <div className="p-4 text-center">
      <p className="text-red-600 font-semibold">Authentication Error</p>
      <p className="text-gray-600 mt-2">There was a problem initializing the auth system.</p>
    </div>
  );

  return (
    <ErrorBoundary fallback={authErrorFallback}>
      <Suspense fallback={<div>Loading auth...</div>}>
        <AuthProviderContent>{children}</AuthProviderContent>
      </Suspense>
    </ErrorBoundary>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to skip useQuery when conditions aren't met
function skip() {
  return undefined as any; // Type hack to skip query
}