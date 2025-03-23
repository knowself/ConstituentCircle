'use client';

import { createContext, useContext, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.auth.getCurrentUser);

  const value = {
    user: currentUser || null,
    loading: currentUser === undefined,
    error: null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
