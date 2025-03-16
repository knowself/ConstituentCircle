import '../styles/globals.css'
import '../styles/utilities.css';
import { initOpenAIClient } from '../lib/ai-services/openAIClient';
import { useEffect } from 'react';
import { registerServiceWorker } from '../lib/serviceWorker';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import { LoadingProvider } from '../context/LoadingContext';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { ReactNode } from 'react';

// Create a client with proper environment variable handling and fallback
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Validate that we have a valid Convex URL
if (!convexUrl) {
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please set it to your Convex deployment URL."
  );
}

// Create the Convex client only if we have a valid URL
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function MyApp({ Component, pageProps }: AppProps): ReactNode {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    // Initialize OpenAI client only on the client side
    try {
      initOpenAIClient();
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
    }
  }, []);

  // If we don't have a valid Convex client, show an error message using React.createElement
  if (!convex) {
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
  const TypedConvexProvider = ConvexProvider as React.ComponentType<{client: ConvexReactClient, children: ReactNode}>;
  const TypedAuthProvider = AuthProvider as React.ComponentType<{children: ReactNode}>;
  const TypedLoadingProvider = LoadingProvider as React.ComponentType<{children: ReactNode}>;
  const TypedLayout = Layout as React.ComponentType<{children: ReactNode}>;

  return React.createElement(
    TypedConvexProvider,
    { client: convex, children: 
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