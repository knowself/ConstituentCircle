'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeProvider';
import { 
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline'; 
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'; 

export default function Navigation() { 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];

  const adminLink = { href: '/admin', label: 'Admin', icon: <ShieldCheckIcon className="h-5 w-5 mr-1" /> };

  if (!mounted) {
    return <header className="header h-[130px]"></header>; 
  }

  return (
    <header className="header h-[130px] bg-background dark:bg-background-dark shadow-sm py-2 w-full z-50"> 
      <div className="header-container h-full">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between w-full h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[120px] w-auto py-[5px]" 
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
            <Link
              href="/sign-in"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <UserIcon className="h-5 w-5 mr-1" />
              Login
            </Link>

            <Link
                key={adminLink.href}
                href={adminLink.href}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {adminLink.icon}
                {adminLink.label}
              </Link>

            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                    <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white bg-primary hover:bg-primary/90">Sign Up</button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile header */}
        <div className="lg:hidden flex justify-between items-center w-full">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/constituent-circle-logo.png"
              alt="Constituent Circle"
              className="h-[102px] w-auto py-[5px]" 
            />
          </Link>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {/* SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[130px] left-0 right-0 bg-background dark:bg-background-dark shadow-lg z-50 px-4 py-2 border-t border-gray-200 dark:border-gray-700"> 
          <div className="space-y-1">
            {/* Mobile Navigation Links */}
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
            
            {/* Mobile Auth Links */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                  <UserIcon className="h-5 w-5 mr-1" />
                  Login
              </Link>

              <Link
                  key={adminLink.href}
                  href={adminLink.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                  {adminLink.icon}
                  {adminLink.label}
              </Link>
              <SignedOut>
                  <SignInButton mode="modal">
                      <button onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                      <button onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Sign Up</button>
                  </SignUpButton>
              </SignedOut>
              <SignedIn>
                 <Link href="/user-profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                     Profile
                 </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}