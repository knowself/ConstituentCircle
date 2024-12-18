import '../styles/globals.css'
import '../styles/utilities.css';

import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthProvider } from '../lib/firebase/auth'

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
