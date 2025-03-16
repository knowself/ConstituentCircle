import '../styles/globals.css'
import '../styles/utilities.css';
import { initOpenAIClient } from '../lib/ai-services/openAIClient';
import { useEffect, useState } from 'react';
import { registerServiceWorker } from '../lib/serviceWorker';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { LoadingProvider } from '../context/LoadingContext';
import { ConvexProvider } from "convex/react";
import React, { ReactNode } from 'react';
import { getConvexReactClient } from '../lib/convex/client';

function MyApp({ Component, pageProps }: AppProps): ReactNode {
  // Use state to store the client to ensure it's only created on the client side
  const [convexClient, setConvexClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the Convex client on the client side
    const client = getConvexReactClient();
    setConvexClient(client);
    setIsLoading(false);

    // Register service worker
    registerServiceWorker();

    // Initialize OpenAI client
    try {
      initOpenAIClient();
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
    }
  }, []);

  // Show loading state while initializing
  if (isLoading) {
    return React.createElement(
      'div', 
      { className: "flex items-center justify-center min-h-screen bg-gray-100" },
      React.createElement(
        'p', 
        { className: "text-lg" },
        "Loading application..."
      )
    );
  }

  // If we don't have a valid Convex client, show an error message
  if (!convexClient) {
    return React.createElement(
      'div', 
      { className: "flex items-center justify-center min-h-screen bg-gray-100" },
      React.createElement(
        'div', 
        { className: "p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md" },
        React.createElement(
          'h2', 
          { className: "text-xl font-bold text-red-600 mb-2" },
          "Configuration Error"
        ),
        React.createElement(
          'p', 
          { className: "text-gray-700" },
          "The Convex URL is not properly configured. Please check your environment variables."
        )
      )
    );
  }

  // Create a properly typed wrapper for each component
  const TypedConvexProvider = ConvexProvider as React.ComponentType<{client: any, children: ReactNode}>;
  const TypedAuthProvider = AuthProvider as React.ComponentType<{children: ReactNode}>;
  const TypedLoadingProvider = LoadingProvider as React.ComponentType<{children: ReactNode}>;
  const TypedLayout = Layout as React.ComponentType<{children: ReactNode}>;

  return React.createElement(
    TypedConvexProvider,
    { client: convexClient, children: 
      React.createElement(
        TypedAuthProvider,
        { children: 
          React.createElement(
            TypedLoadingProvider,
            { children: 
              React.createElement(
                TypedLayout,
                { children: 
                  React.createElement(Component, pageProps)
                }
              )
            }
          )
        }
      )
    }
  );
}

export default MyApp