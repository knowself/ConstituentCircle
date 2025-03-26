// app/layout.tsx
import { ClientProviders } from '@/components/providers/ClientProviders'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <ClientProviders>
          {children}
          <Toaster position="bottom-right" />
        </ClientProviders>
      </body>
    </html>
  )
}