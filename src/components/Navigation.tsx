import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTheme, ThemeToggle } from './ThemeProvider';
import './Navbar.css';

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
  
  // Mobile navigation
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
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
              <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
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
              href="/admin/login"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop navigation
  return (
    <div className="container mx-auto">
      <nav className="flex items-center justify-between py-2">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[40px] w-auto"
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <ThemeToggle />
          
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;