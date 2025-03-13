'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

import { Role } from '../lib/types/roles';

interface UserProfile {
  id: string;
  role: Role;
  displayName?: string;
  email: string;
  metadata?: Record<string, any>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: Role, metadata?: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Convex mutations
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.register);
  const logoutMutation = useMutation(api.auth.logout);
  const updateProfileMutation = useMutation(api.auth.updateProfile);
  
  // Convex query to get current user
  const currentUser = useQuery(api.auth.getCurrentUser);

  useEffect(() => {
    // Set user from Convex query result
    if (currentUser !== undefined) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await login({ email, password });
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, role: Role, metadata: Record<string, any> = {}) => {
    try {
      setError(null);
      const result = await register({ 
        email, 
        password, 
        role, 
        metadata 
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const result = await logoutMutation();
      if (!result.success) {
        throw new Error(result.error);
      }
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to log out';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const result = await updateProfileMutation({ 
        userId: user.id,
        ...data 
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
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
