/**
 * Layout Component
 * 
 * Core layout component that wraps all pages in the application.
 * Provides consistent navigation, theme switching, and responsive design.
 * 
 * Features:
 * - Persistent dark/light mode with local storage
 * - Responsive navigation with mobile menu
 * - Hydration-safe theme switching
 * - Consistent header and footer across pages
 * 
 * @module Components/Core
 */

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

/**
 * Props for the Layout component
 * @interface LayoutProps
 * @property {ReactNode} children - Child components to be wrapped by the layout
 */
type LayoutProps = {
  children: ReactNode;
};

/**
 * Navigation link structure
 * @interface NavLink
 * @property {string} href - URL path for the link
 * @property {string} label - Display text for the link
 */
interface NavLink {
  href: string;
  label: string;
}

/**
 * Layout Component
 * Provides the main layout structure for all pages
 * 
 * @component
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} Rendered layout component
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // State management for theme and mobile menu
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  /**
   * Initialize theme from local storage and handle hydration
   */
  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem('darkMode');
    setIsDarkMode(storedDarkMode === 'true');
    if (storedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Close mobile menu on route change
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  if (!mounted) {
    return <div className="min-h-screen bg-white" />; // Basic loader
  }

  /**
   * Toggle dark mode and update local storage
   */
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation configuration - extend or modify to update site navigation
  const navigationLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/constituent-circle-logo.png"
                  alt="Constituent Circle"
                  width={125}
                  height={125}
                  className="h-[125px] w-[125px]"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium ${
                    router.pathname === link.href
                      ? 'text-secondary'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Theme toggle button */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === link.href
                    ? 'text-secondary bg-gray-50 dark:bg-gray-700'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

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
};

export default Layout;
