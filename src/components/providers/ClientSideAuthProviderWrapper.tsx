'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface ClientSideAuthProviderWrapperProps {
  children: ReactNode;
}

export function ClientSideAuthProviderWrapper({ children }: ClientSideAuthProviderWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
