'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
  if (!url) {
    console.error('Convex URL not found in environment variables');
  }
  return url;
}

const convexUrl = getConvexUrl();
const convexClient = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
