"use client"

import { ClientSideAuthProviderWrapper } from './ClientSideAuthProviderWrapper'; 
import { ThemeProvider } from '@/components/ThemeProvider'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { getConvexReactClient } from '@root/lib/convex/client'
import { ErrorBoundary } from '../ErrorBoundary'
import React, { useMemo } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!); 

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  console.log('ClientProviders rendering');

  const convexClient = useMemo(() => convex, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ConvexProvider client={convexClient}>
          <ClientSideAuthProviderWrapper>
            {children}
          </ClientSideAuthProviderWrapper>
        </ConvexProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}