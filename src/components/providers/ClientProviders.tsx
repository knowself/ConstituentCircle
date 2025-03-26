"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { AuthProvider } from '@/context/AuthProvider'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConvexProvider>
  )
}