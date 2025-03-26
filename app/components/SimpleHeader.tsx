'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../header.css';

export default function SimpleHeader() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link href="/">
          <img
            src="/constituent-circle-logo.png"
            alt="Constituent Circle"
            className="logo"
          />
        </Link>
        
        {/* Navigation Links */}
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link href="/services" className={`nav-link ${isActive('/services')}`}>
            Services
          </Link>
          <Link href="/blog" className={`nav-link ${isActive('/blog')}`}>
            Blog
          </Link>
          <Link href="/contact" className={`nav-link ${isActive('/contact')}`}>
            Contact
          </Link>
        </nav>
        
        {/* Right side items */}
        <div className="auth-links">
          <button className="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
          
          <Link href="/signin" className="nav-link">
            Sign In
          </Link>
          
          <Link href="/admin/login" className="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button className="mobile-menu-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}