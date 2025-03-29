"use client"

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ConvexProvider } from 'convex/react'
import { getConvexReactClient } from '@/lib/convex/client'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import React from 'react' // Import React for Fragment

// Get the client instance
const convexClient = getConvexReactClient()

export function ClientProviders({ children }: { children: React.ReactNode }) {
  console.log('ClientProviders rendering');
  // Render children directly if Convex client isn't available
  // This might happen during SSR or if the URL is missing
  if (!convexClient) {
    console.warn('Convex client not available, rendering without ConvexProvider.')
    return (
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    )
  }

  // Render with ConvexProvider if the client is available
  return (
    <ErrorBoundary>
      <ConvexProvider client={convexClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </ConvexProvider>
    </ErrorBoundary>
  )
}