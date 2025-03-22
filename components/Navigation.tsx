'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTheme, ThemeToggle } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ 
  isMobile = false
}: { 
  isMobile?: boolean
}) => {
  const pathname = usePathname();
  const { user, loading: isLoading } = useAuth();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ];

  // Add protected links based on user role
  if (user) {
    switch (user.role) {
      case 'admin':
        links.push({ href: '/admin/dashboard', label: 'Dashboard' });
        break;
      case 'constituent':
        links.push({ href: '/constituent/dashboard', label: 'Dashboard' });
        break;
      case 'company_admin':
      case 'company_manager':
      case 'company_support':
      case 'company_analyst':
        links.push({ href: '/company/dashboard', label: 'Dashboard' });
        break;
      case 'representative':
        links.push({ href: '/representative/dashboard', label: 'Dashboard' });
        break;
      case 'campaign_manager':
      case 'campaign_coordinator':
      case 'field_organizer':
      case 'volunteer_coordinator':
        links.push({ href: '/campaign/dashboard', label: 'Dashboard' });
        break;
      case 'office_admin':
      case 'staff_member':
      case 'temp_staff':
      case 'intern':
        links.push({ href: '/office/dashboard', label: 'Dashboard' });
        break;
      default:
        // For any new roles, default to constituent dashboard
        console.warn('Unknown role:', user.role);
        links.push({ href: '/constituent/dashboard', label: 'Dashboard' });
    }
  }
  
  // If this is the mobile version, render mobile-specific navigation
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              pathname === link.href
                ? "text-secondary bg-gray-50 dark:bg-gray-700"
                : "text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
        
        {/* Dark/Light mode toggle for mobile */}
        <div className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <span className="mr-2">Theme</span>
          <ThemeToggle />
        </div>
        
        {/* Auth links for mobile */}
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          {!isLoading && (
            <div className="flex items-center px-3">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-foreground/70" />
              </div>
              <div className="ml-3">
                {user ? (
                  <div className="text-base font-medium text-foreground space-y-2">
                    <div className="flex items-center">
                      {user.displayname || user.name || user.email}
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/signout"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Sign Out
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <UserIcon className="inline-block h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <PlusIcon className="inline-block h-5 w-5 mr-2" />
                      Join
                    </Link>
                    <Link
                      href="/admin/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <ShieldCheckIcon className="inline-block h-5 w-5 mr-2" />
                      Admin
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop navigation
  return (
    <nav className="hidden lg:flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center">
          <img
            src="/constituent-circle-logo.png"
            alt="Constituent Circle"
            className="h-[130px] w-auto"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex lg:items-center lg:space-x-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-base font-medium transition-colors duration-200 ${
              pathname === link.href
                ? "text-secondary"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side items */}
      <div className="hidden lg:flex lg:items-center lg:space-x-6">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Auth section */}
        {!isLoading && (
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <UserIcon className="h-6 w-6 text-foreground/70" />
                <span className="text-base font-medium text-foreground">
                  {user.displayname || user.name || user.email}
                </span>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center"
                  >
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/signout"
                  className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Join
                </Link>
                <Link
                  href="/admin/login"
                  className="text-base font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center"
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Admin
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;