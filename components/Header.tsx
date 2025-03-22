'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';

interface HeaderProps {
  showMobileMenu?: boolean;
}

export default function Header({ showMobileMenu = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize component
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent hydration mismatch by only rendering content after mount
  if (!mounted) {
    return <div className="bg-white dark:bg-gray-800 shadow-sm py-4 w-full h-[130px]" />; // Basic loader
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 w-full z-50 h-[130px]">
      {/* Desktop Navigation - hidden on mobile */}
      <div className="hidden lg:block h-full">
        <Navigation />
      </div>
      
      {/* Mobile header with logo and menu button */}
      <div className="lg:hidden flex justify-between items-center px-4 h-full">
        <Link href="/" className="flex items-center">
          <img
            src="/constituent-circle-logo.png"
            alt="Constituent Circle"
            className="h-[130px] w-auto"
          />
        </Link>
        
        {showMobileMenu && (
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        )}
      </div>
      
      {/* Mobile menu panel - consolidated version */}
      {showMobileMenu && (
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden absolute left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation */}
            <Navigation isMobile={true} />
          </div>
        </div>
      )}
    </header>
  );
}
