import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTheme, ThemeToggle } from './ThemeProvider';

const Navigation = ({ 
  isMobile = false
}: { 
  isMobile?: boolean
}) => {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];
  
  // If this is the mobile version, render mobile-specific navigation
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 lg:hidden">
        {/* Logo removed from mobile navigation since it's already in the header */}
        
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              pathname === link.href
                ? "text-secondary bg-gray-50 dark:bg-gray-700"
                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
        
        {/* Dark/Light mode toggle for mobile */}
        <div className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <span className="mr-2">Theme</span>
          <ThemeToggle />
        </div>
        
        {/* Auth links for mobile */}
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-3">
            <div className="flex-shrink-0">
              <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
            </div>
            <div className="ml-3">
              <Link
                href="/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="/signup"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Account
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop navigation
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center justify-center">
          <img
            src="/constituent-circle-logo.png"
            alt="Constituent Circle"
            className="h-[110px] w-auto"
          />
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center space-x-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              pathname === link.href
                ? "text-secondary bg-gray-50 dark:bg-gray-700"
                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      <div className="hidden lg:flex items-center space-x-4">
        {/* Dark/Light mode toggle for desktop */}
        <ThemeToggle />
        
        {/* Auth links for desktop */}
        <div className="flex items-center space-x-2 ml-4">
          <Link
            href="/signup"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create Account
          </Link>
          <Link
            href="/signin"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <UserIcon className="h-5 w-5 mr-1" />
            Sign In
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-1" />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;