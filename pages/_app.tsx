import '../styles/globals.css'
import '../styles/utilities.css';
import { initOpenAIClient } from '../lib/ai-services/openAIClient';
import { useEffect } from 'react';
import { registerServiceWorker } from '../lib/serviceWorker';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { AuthProvider } from '../context/AuthContext';
import { LoadingProvider } from '../context/LoadingContext';

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
    <AuthProvider>
      <LoadingProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoadingProvider>
    </AuthProvider>
  )
}

export default MyApp