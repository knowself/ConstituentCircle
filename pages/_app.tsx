import type { AppProps } from 'next/app';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useEffect, useState } from 'react';

// Create a Convex client outside of the component
let convexClient: ConvexReactClient | null = null;

if (typeof window !== 'undefined') {
  // Initialize in a setTimeout to ensure it happens after hydration
  setTimeout(() => {
    if (!convexClient) {
      try {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL || (window.ENV?.CONVEX_URL || '');
        if (url) {
          console.log('Initializing Convex client in _app.tsx with URL:', url);
          convexClient = new ConvexReactClient(url);
          console.log('Convex client successfully initialized in _app.tsx');
        }
      } catch (error) {
        console.error('Failed to initialize Convex client in _app.tsx:', error);
      }
    }
  }, 0);
}

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, render without ConvexProvider
  if (!isClient) {
    return <Component {...pageProps} />;
  }

  // If client is available, use it
  if (convexClient) {
    return (
      <ConvexProvider client={convexClient}>
        <Component {...pageProps} />
      </ConvexProvider>
    );
  }

  // Fallback if client isn't initialized yet
  return <Component {...pageProps} />;
}
