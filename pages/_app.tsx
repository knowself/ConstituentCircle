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

// Create a client with proper environment variable handling and fallback
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexReactClient(convexUrl);

function MyApp({ Component, pageProps }: AppProps) {
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

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <LoadingProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LoadingProvider>
      </AuthProvider>
    </ConvexProvider>
  )
}

export default MyApp