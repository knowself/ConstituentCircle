import '../styles/globals.css'
import '../styles/utilities.css';
import { initOpenAIClient } from '../lib/ai-services/openAIClient';

import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthProvider } from '../context/AuthContext'

initOpenAIClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
