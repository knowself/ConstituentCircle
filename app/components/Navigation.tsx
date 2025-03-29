'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeProvider';
import { UserIcon, PlusCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import '../header.css';

export default function Navigation() { // Renamed component
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Initialize component
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];

  const authLinks = [
    { href: '/login', label: 'Sign In', icon: <UserIcon className="h-5 w-5 mr-1" /> },
    { href: '/signup', label: 'Create Account', icon: <PlusCircleIcon className="h-5 w-5 mr-1" /> },
    { href: '/admin', label: 'Admin', icon: <ShieldCheckIcon className="h-5 w-5 mr-1" /> }
  ];

  // Prevent hydration mismatch by only rendering content after mount
  if (!mounted) {
    return <header className="header h-[130px]"></header>; // Basic loader - Increased height
  }

  return (
    <header className="header h-[130px] bg-background dark:bg-background-dark shadow-sm py-2 w-full z-50"> {/* Increased height for larger logo */}
      <div className="header-container h-full">
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden lg:flex items-center justify-between w-full h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[120px] w-auto py-[5px]" // Set to specific size of 120px as requested
            />
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-primary bg-gray-50 dark:bg-gray-700"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Auth Links and Theme Toggle for Desktop */}
          <div className="flex items-center space-x-4">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile header with logo and menu button */}
        <div className="lg:hidden flex justify-between items-center w-full">
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[102px] w-auto py-[5px]" // Set to proportional size of 102px
            />
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[130px] left-0 right-0 bg-background dark:bg-background-dark shadow-lg z-50 px-4 py-2 border-t border-gray-200 dark:border-gray-700"> {/* Updated top position */}
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-primary bg-gray-50 dark:bg-gray-700"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}