'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AuthNavHeader() {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin/login');
  const [mounted, setMounted] = useState(false);
  
  console.log('AuthNavHeader rendering, pathname:', pathname);
  
  // Use useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything until after client-side hydration
  if (!mounted) {
    return null;
  }
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
      {/* Debug element */}
      <div className="bg-red-500 text-white p-1 text-xs">Navigation Header</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center">
            {/* Comment out the logo temporarily */}
            {/*<img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-10 w-auto"
            />*/}
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Constituent Circle
            </span>
          </Link>
          
          {/* Navigation links */}
          <div className="flex space-x-4 items-center">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
            >
              Home
            </Link>
            {isAdminPage ? (
              <Link 
                href="/auth/signin" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
              >
                User Login
              </Link>
            ) : (
              <Link 
                href="/admin/login" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}