'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthNavLinks() {
  const pathname = usePathname();
  
  // Determine if we're on admin or regular auth page
  const isAdminPage = pathname?.includes('/admin/login');
  
  return (
    <>
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
    </>
  );
}