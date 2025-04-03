"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { User } from "@/hooks/useAuth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const typedApi = api as any;
  
  const currentUser = useQuery(typedApi.auth.getCurrentUser);
  
  const login = useMutation(typedApi.auth.login);
  const signup = useMutation(typedApi.auth.signup);
  const logoutMutation = useMutation(typedApi.auth.logout);
  const updateProfileMutation = useMutation(typedApi.auth.updateProfile);

  useEffect(() => {
    if (currentUser === undefined) {
      setIsLoading(true);
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await signup({ email, password, name });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const handleUpdateProfile = async (userData: Partial<User>) => {
    try {
      await updateProfileMutation({ updates: userData });
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}