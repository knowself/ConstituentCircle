'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavHeader() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-10 w-auto"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white hidden sm:inline">
              JConstituent Circle
            </span>
          </Link>
          
          <div className="flex space-x-4 items-center">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
            >
              Home
            </Link>
            <Link 
              href="/auth/signin" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base px-4 py-2 border border-transparent rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              User Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}