import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, ShieldCheckIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navigation = ({ 
  isMobile = false,
  isDarkMode = false,
  toggleDarkMode
}: { 
  isMobile?: boolean,
  isDarkMode?: boolean,
  toggleDarkMode?: () => void 
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
        {toggleDarkMode && (
          <button
            onClick={toggleDarkMode}
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        )}
        
        {/* Auth links for mobile - stacked vertically without text labels */}
        <Link
          href="/auth/signin"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title="User Login"
        >
          <UserIcon className="h-5 w-5" />
        </Link>
        
        <Link
          href="/admin/login"
          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Admin Login"
        >
          <ShieldCheckIcon className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  // Desktop navigation - fixed to ensure it's visible on large screens
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
      
      <div className="flex items-center space-x-10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-base font-medium transition-colors duration-200 hover:opacity-80 ${
              pathname === link.href
                ? "text-secondary"
                : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
        
        {/* Auth icons for desktop */}
        <div className="flex items-center space-x-4">
          {/* Add dark/light mode toggle for desktop */}
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          )}
          
          <Link
            href="/auth/signin"
            className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
            title="User Login"
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          
          <Link
            href="/admin/login"
            className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
            title="Admin Login"
          >
            <ShieldCheckIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;