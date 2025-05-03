'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
//import { api } from '../convex/_generated/api'; //Removed Convex API import
import { useQuery, useAction } from 'convex/react'; //Keeping this for now, might need removal later
import type { User } from '@/types/auth';
import { DatabaseService } from "../lib/database/service"; // Added Replit DB service


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
  //const validateSession = useAction(api.auth.validateSession); // Removed Convex action
  const databaseService = new DatabaseService(); // Initialize Replit DB service

  const initializeAuth = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('authToken');
      if (token) {
        //const validUser = await validateSession({ token }); // Removed Convex validation
        // Replace with Replit DB user validation
        const validUser = await databaseService.validateSession(token);
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
  }, [databaseService]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("AuthProvider useEffect: Running on client, calling initializeAuth");
      initializeAuth();
    } else {
      console.log("AuthProvider useEffect: Running on server, skipping initializeAuth");
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);
      // Replace with Replit DB login
      const user = await databaseService.login(email, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error || `Sign in failed with status: ${response.status}`;
        console.error("Sign in error from API:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Sign in successful via API route. User ID:", data?.userId);
      setUser(null); //Assume refresh handles fetching new data

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed due to an unexpected error.');
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
      // Replace with Replit DB signup
      const user = await databaseService.signUp(email, password, role, metadata);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (!isInitialized) return;
    // Replace with Replit DB logout
    databaseService.logout();
    setUser(null);
    localStorage.removeItem('authToken');
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