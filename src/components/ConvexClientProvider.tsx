'use client';

import { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Global client instance
let convexClient: ConvexReactClient | null = null;

function getConvexUrl(): string {
  if (typeof window !== 'undefined' && window.ENV?.CONVEX_URL) {
    return window.ENV.CONVEX_URL;
  }
  return process.env.NEXT_PUBLIC_CONVEX_URL || '';
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (!convexClient) {
      const url = getConvexUrl();
      if (!url) {
        console.error('Convex URL not found');
        return;
      }

      try {
        convexClient = new ConvexReactClient(url);
        // For debugging
        if (typeof window !== 'undefined') {
          window.__CONVEX_STATE = { client: convexClient };
        }
        setClient(convexClient);
      } catch (err) {
        console.error('Convex initialization error:', err);
      }
    } else {
      setClient(convexClient);
    }
  }, []);

  if (!client) {
    return <div className="p-4">Connecting to Convex...</div>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
