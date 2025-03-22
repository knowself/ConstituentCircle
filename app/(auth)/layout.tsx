'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const inter = Inter({ subsets: ['latin'] });

// Helper function to get the Convex URL from available sources
function getConvexUrl(): string {
  // Try to get the URL from process.env first
  let url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
  
  // If not available, try window.ENV
  if (!url && typeof window !== 'undefined' && window.ENV && window.ENV.CONVEX_URL) {
    url = window.ENV.CONVEX_URL;
  }
  
  return url;
}

// Initialize client outside component (only on client side)
let convexClient: ConvexReactClient | null = null;

// Only initialize on client side
if (typeof window !== 'undefined') {
  const url = getConvexUrl();
  if (url) {
    convexClient = new ConvexReactClient(url);
  }
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For server-side rendering, return children without the provider
  if (typeof window === 'undefined') {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900">
        <main className={`h-full ${inter.className}`}>
          {children}
        </main>
      </div>
    );
  }

  // Client-side rendering with provider
  return (
    <>
      {convexClient ? (
        <ConvexProvider client={convexClient}>
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            <main className={`h-full ${inter.className}`}>
              {children}
            </main>
          </div>
        </ConvexProvider>
      ) : (
        <div className="h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <p>Initializing Convex client...</p>
        </div>
      )}
    </>
  );
}
