import AuthLayout from '../../components/AuthLayout';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import AuthNavHeader from '../../components/AuthNavHeader';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50 dark:bg-gray-900">
      <body className={`h-full ${inter.className}`}>
        <AuthNavHeader />
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}