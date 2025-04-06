'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface ClientSideAuthProviderWrapperProps {
  children: ReactNode;
}

export function ClientSideAuthProviderWrapper({ children }: ClientSideAuthProviderWrapperProps) {
  if (typeof window !== 'undefined') {
    console.log(`ClientSideAuthProviderWrapper rendering for path: ${window.location.pathname}`);
  } else {
    console.log('ClientSideAuthProviderWrapper rendering - Server-side or initial load');
  }
  return <AuthProvider>{children}</AuthProvider>;
}
