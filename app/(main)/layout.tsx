'use client';

import { ReactNode } from 'react';
import Header from '../../components/Header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
