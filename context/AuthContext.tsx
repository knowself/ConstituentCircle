'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../convex/_generated/api';
import { useQuery, useAction } from 'convex/react';
import type { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  signIn: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const validateSession = useAction(api.auth.validateSession);
  const getCurrentUser = useQuery(api.users.getCurrentUser, {});

  const login = async (email: string, password: string) => {
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
    try {
      setIsLoading(true);
      setError(null);
      // Sign in implementation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Logout implementation
  };

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
    } catch (err) {
      setError('Failed to initialize authentication');
      console.error('Auth initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [validateSession]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (getCurrentUser) {
      setUser(getCurrentUser);
    }
  }, [getCurrentUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    signIn,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
