'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  avatar_url?: string;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, any>;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: Role, metadata?: Record<string, any>) => Promise<void>;
  logout: (forceRedirect?: boolean) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Convex mutations
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.register);
  const logoutMutation = useMutation(api.auth.logout);
  const updateProfileMutation = useMutation(api.auth.updateProfile);
  const cleanupExpiredSessionsMutation = useMutation(api.auth.cleanupExpiredSessions);
  
  // Convex query to get current user
  const currentUser = useQuery(api.auth.getCurrentUser, sessionToken ? { token: sessionToken } : { token: undefined });

  // This effect loads the session token from localStorage on mount
  // and updates the token state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sessionToken');
      console.log('Initial session token from localStorage:', token ? 'exists' : 'none');
      setSessionToken(token);
      
      // If no token is found, ensure user is null
      if (!token) {
        setUser(null);
      }
    }
    
    // Set mounted state to true
    setMounted(true);
  }, []);

  // Effect to handle user state changes based on currentUser query
  useEffect(() => {
    const handleUserStateChange = async () => {
      try {
        // Set user from Convex query result
        if (currentUser !== undefined) {
          if (currentUser) {
            // Map the Convex user to our UserProfile interface
            setUser({
              id: currentUser._id,
              role: currentUser.role as Role,
              email: currentUser.email,
              displayName: currentUser.name,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
            });
          } else {
            // If currentUser is null, clear the session token
            localStorage.removeItem('sessionToken');
            setSessionToken(null);
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error handling user state change:', error);
        setLoading(false);
      }
    };
    
    handleUserStateChange();
  }, [currentUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      // Pass email and password as separate parameters to match the interface
      const result = await login({ email, password });
      console.log('Login result in AuthContext:', result);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Store the session token
      if (result.token) {
        localStorage.setItem('sessionToken', result.token);
        setSessionToken(result.token);
      }
      
      // Force refresh the current user query
      // This is important to update the user state after login
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return result;
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

  const logout = async (forceRedirect = true) => {
    try {
      console.log('Logout started');
      setError(null);
      // Get the token from localStorage
      const token = localStorage.getItem('sessionToken');
      console.log('Current token:', token);
      
      // First clear session token from localStorage and state
      // This prevents redirect loops during logout
      localStorage.removeItem('sessionToken');
      setSessionToken(null);
      setUser(null);
      console.log('Local state cleared');
      
      // Then call the logout mutation with the token
      if (token) {
        try {
          console.log('Calling logout mutation with token');
          const result = await logoutMutation({ token });
          console.log('Logout mutation result:', result);
        } catch (mutationError) {
          console.error('Error in logout mutation:', mutationError);
          // Continue with redirect even if mutation fails
        }
      }
      
      // Redirect to login page after logout if forceRedirect is true
      if (forceRedirect) {
        console.log('Redirecting to login page');
        // Add a small delay to ensure the logout mutation completes
        setTimeout(() => {
          // Force a full page reload to clear any stale state
          window.location.replace('/admin/login?logout=true');
        }, 500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to log out';
      setError(errorMessage);
      console.error('Logout error:', errorMessage);
      
      // Even if there's an error, ensure local state is cleared
      localStorage.removeItem('sessionToken');
      setSessionToken(null);
      setUser(null);
      
      // Still redirect to login page if forceRedirect is true
      if (forceRedirect) {
        console.log('Redirecting to login page after error');
        setTimeout(() => {
          window.location.replace('/admin/login?logout=true');
        }, 500);
      }
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

  // Function to clean up expired sessions
  const cleanupExpiredSessions = async () => {
    try {
      const result = await cleanupExpiredSessionsMutation({});
      console.log(`Cleaned up ${result} expired sessions`);
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  };

  // Clean up expired sessions on mount
  useEffect(() => {
    if (mounted) {
      cleanupExpiredSessions();
    }
  }, [mounted]);

  // Redirect based on user role
  const redirectBasedOnRole = useCallback(() => {
    if (!user) return;
    
    const path = window.location.pathname;
    
    // If user is admin and not on admin pages, redirect to admin dashboard
    if (user.role === 'admin') {
      if (!path.startsWith('/admin')) {
        console.log('Admin user redirected to admin dashboard');
        window.location.href = '/admin/dashboard';
      }
    } else {
      // If non-admin user tries to access admin pages, redirect to dashboard
      if (path.startsWith('/admin')) {
        console.log('Non-admin user redirected to dashboard');
        window.location.href = '/dashboard';
      }
    }
  }, [user]);
  
  // Check and redirect on role changes
  useEffect(() => {
    if (!loading && user) {
      redirectBasedOnRole();
    }
  }, [loading, user, redirectBasedOnRole]);

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
