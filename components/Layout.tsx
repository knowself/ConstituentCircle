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

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  SunIcon, 
  MoonIcon, 
  LockClosedIcon, 
  ArrowRightOnRectangleIcon as LogoutIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import type { User } from '@supabase/supabase-js';

/**
 * Props for the Layout component
 * @interface LayoutProps
 * @property {ReactNode} children - Child components to be wrapped by the layout
 */
interface LayoutProps {
  children: ReactNode;
}

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
export default function Layout({ children }: LayoutProps) {
  // State management for theme and mobile menu
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Add state for dropdown menus
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Update user photo and display name references
  // Update user metadata access with proper type checking
  const userAvatar = user?.user_metadata?.avatar_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}`;
  const userDisplayName = user?.email || 'User';
  // Initialize theme from local storage and handle hydration
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
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);
  
  // Handle dropdown toggle
  const toggleDropdown = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  if (!mounted) {
    return <div className="min-h-screen bg-white" />; // Basic loader
  }
  
  // Toggle dark mode and update local storage
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
  
  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Keep the existing navigation links
  const navigationLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 fixed w-full top-0 z-50 h-[145px]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center justify-center">
                <img
                  src="/constituent-circle-logo.png"
                  alt="Constituent Circle"
                  className="h-[110px] w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation - Centered with updated styling */}
            <div className="hidden lg:flex items-center justify-center flex-grow space-x-10 ml-10">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors duration-200 hover:opacity-80 ${
                    router.pathname === link.href
                      ? 'text-secondary'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Theme toggle with updated styling */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
              {/* Auth button with updated styling */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={userAvatar} 
                      alt={userDisplayName}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogoutIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button with updated styling */}
          <div className="lg:hidden absolute right-4 top-4">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
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
        </nav>
        
        {/* Mobile menu panel with updated styling */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  router.pathname === link.href
                    ? 'text-secondary bg-gray-50 dark:bg-gray-700'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Theme toggle in mobile menu */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDarkMode ? (
                <>
                  <SunIcon className="h-5 w-5 mr-2" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5 mr-2" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            {/* Auth button in mobile menu */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogoutIcon className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[145px]">{children}</main>
      
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
