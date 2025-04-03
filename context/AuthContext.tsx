'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../convex/_generated/api';
import { useQuery, useAction } from 'convex/react';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    role: string,
    metadata: Record<string, any>
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const validateSession = useAction(api.auth.validateSession);
  const signUpAction = useAction(api.auth.signup);

  const initializeAuth = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('authToken');
      if (token) {
        const validUser = await validateSession({ token });
        if (validUser) {
          setUser(validUser);
        } else {
          localStorage.removeItem('authToken');
        }
      }
      setIsInitialized(true);
    } catch (err) {
      setError('Failed to initialize authentication');
      console.error('Auth initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [validateSession]);

  useEffect(() => {
    // Initialize auth state on mount only on the client
    if (typeof window !== 'undefined') {
      console.log("AuthProvider useEffect: Running on client, calling initializeAuth");
      initializeAuth();
    } else {
      // On the server, ensure we are marked as loading but not initialized yet
      // This state should be consistent until client-side hydration takes over
      console.log("AuthProvider useEffect: Running on server, skipping initializeAuth");
      // State defaults (isLoading: true, isInitialized: false) are already set
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      // Login implementation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Removed isInitialized check, API route is independent
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', { // Use the API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Attempt to parse JSON regardless of status

      if (!response.ok) {
        // Use error message from API response if available, otherwise generic message
        const errorMessage = data?.error || `Sign in failed with status: ${response.status}`;
        console.error("Sign in error from API:", errorMessage);
        throw new Error(errorMessage);
      }

      // Sign-in successful! Cookie is set by the API route.
      console.log("Sign in successful via API route. User ID:", data?.userId);

      // Clear potentially stale user data. Assume redirect/refresh handles fetching new data.
      setUser(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed due to an unexpected error.');
      // Re-throw the error so the calling component can potentially handle it too
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: string, metadata: Record<string, any>) => {
    if (!isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await signUpAction({
        email,
        password,
        name: `${metadata.firstName} ${metadata.lastName}`,
        metadata
      });
      setUser(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (!isInitialized) return;
    // Logout implementation
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    error,
    login,
    signIn,
    signUp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
