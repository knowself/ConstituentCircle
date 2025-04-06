// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation' // Navigation component
import './globals.css'

export const metadata = {
  title: 'Constituent Circle',
  description: 'Manage constituent relationships effectively',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background dark:bg-background-dark text-foreground dark:text-text-light">
          <ClientProviders>
            <Navigation /> {/* Add the header here */}
            <main className="pt-0"> {/* Removed padding-top completely */}
              {children}
            </main>
            <Toaster position="bottom-right" />
            <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
              </p>
            </footer>
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}