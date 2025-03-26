'use client';

import { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface User {
  id: string;
  email: string;
  role?: string; 
  name?: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.auth.getCurrentUser);

  const value: AuthContextType = {
    user: currentUser || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
