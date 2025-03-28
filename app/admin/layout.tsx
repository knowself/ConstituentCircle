import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <main className={`h-full ${inter.className}`}>
        {children}
      </main>
    </div>
  );
}