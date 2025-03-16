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
import Navigation from './Navigation';

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
  const userAvatar = user?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email ?? 'User')}`;
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
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 fixed w-full top-0 z-50 h-[145px]">
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden lg:block">
          <Navigation 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
          />
        </div>
        
        {/* Mobile header with logo and menu button */}
        <div className="lg:hidden flex justify-between items-center px-4">
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[80px] w-auto"
            />
          </Link>
          
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu panel - consolidated version */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden absolute top-[145px] left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation */}
            <Navigation 
              isMobile={true} 
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
            
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
