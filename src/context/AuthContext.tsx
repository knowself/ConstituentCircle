import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use existing login function that works with profiles table
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.register);
  const getCurrentUser = useQuery(api.auth.getCurrentUser);

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      return;
    }

    // If we have user data from the query
    if (getCurrentUser) {
      setUser({
        id: getCurrentUser.id,
        email: getCurrentUser.email,
        name: getCurrentUser.name,
        role: getCurrentUser.role
      });
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        return false;
      }
      
      // Store auth data
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", result.name || email.split('@')[0]);
      localStorage.setItem("userRole", result.role || "");
      
      setUser({
        id: result.userId,
        email,
        name: result.name || email.split('@')[0],
        role: result.role
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const result = await register({ email, password, name });
      
      if (!result.success) {
        return false;
      }
      
      // Store auth data
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", result.role || "");
      
      setUser({
        id: result.userId,
        email,
        name,
        role: result.role
      });
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  // This is a placeholder - you'll need to implement Google auth separately
  const loginWithGoogle = async (token: string) => {
    console.warn("Google login not implemented yet");
    return false;
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        loginWithGoogle,
        register: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};