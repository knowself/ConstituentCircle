/**
 * Layout Component
 * 
 * Core layout component that wraps all pages in the application.
 * Provides consistent navigation, theme switching, and responsive design.
 * 
 * Features:
 * - Responsive navigation with mobile menu
 * - Consistent header and footer across pages
 * 
 * @module Components/Core
 */

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  LockClosedIcon, 
  ArrowRightOnRectangleIcon as LogoutIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

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
  
  // Initialize component
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  
  // Prevent hydration mismatch by only rendering content after mount
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />; // Basic loader
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
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
