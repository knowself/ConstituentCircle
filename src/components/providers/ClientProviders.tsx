"use client"

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
  // Add log including window.location.pathname if possible (only works client-side)
  if (typeof window !== 'undefined') {
    console.log(`ClientProviders rendering for path: ${window.location.pathname} (Direct AuthProvider)`);
  } else {
    console.log('ClientProviders rendering (Direct AuthProvider) - Server-side or initial load');
  }

  const convexClient = useMemo(() => convex, []);

  return (
    <ErrorBoundary> 
      <ThemeProvider> 
        {/* ConvexProvider now needs Clerk auth, provided by ClerkProvider in layout.tsx */}
        <ConvexProvider client={convexClient}>
          {/* AuthProvider removed, ClerkProvider handles auth context */}
          {children}
        </ConvexProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}