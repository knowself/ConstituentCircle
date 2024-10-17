import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Constituent Circle Logo" className="h-8 w-auto" />
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="text-primary hover:text-secondary">Home</Link></li>
              <li><Link href="/services" className="text-primary hover:text-secondary">Services</Link></li>
              <li><Link href="/faq" className="text-primary hover:text-secondary">FAQ</Link></li>
              <li><Link href="/blog" className="text-primary hover:text-secondary">Blog</Link></li>
              <li><Link href="/contact" className="text-primary hover:text-secondary">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-primary text-text-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <img src="/logo-white.png" alt="Constituent Circle Logo" className="h-8 w-auto" />
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-secondary">Home</Link></li>
                <li><Link href="/services" className="hover:text-secondary">Services</Link></li>
                <li><Link href="/faq" className="hover:text-secondary">FAQ</Link></li>
                <li><Link href="/blog" className="hover:text-secondary">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-4 text-center">
            <p>&copy; 2024 Constituent Circle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
