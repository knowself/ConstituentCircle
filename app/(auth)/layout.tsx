import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <main className={`h-full ${inter.className}`}>
        {children}
      </main>
    </div>
  );
}
