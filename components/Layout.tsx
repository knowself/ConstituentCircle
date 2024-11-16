import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  if (!mounted) {
    return <div className="min-h-screen bg-white" />; // Basic loader
  }

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationLinks = [
    { href: "/", text: "Home" },
    { href: "/services", text: "Services" },
    { href: "/faq", text: "FAQ" },
    { href: "/blog", text: "Blog" },
    { href: "/contact", text: "Contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="relative w-[100px] h-[100px]">
                <Image 
                  src="/constituent-circle-logo.png" 
                  alt="Constituent Circle Logo"
                  fill
                  sizes="100px"
                  priority
                  className="object-contain"
                />
              </Link>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6 items-center">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className={`text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors duration-200 ${
                        router.pathname === link.href ? 'font-semibold' : ''
                      }`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={toggleDarkMode} 
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="text-gray-900 dark:text-gray-100"
                aria-label="Toggle mobile menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg">
            <nav className="px-4 py-2">
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className={`block py-2 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors duration-200 ${
                        router.pathname === link.href ? 'font-semibold' : ''
                      }`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={toggleDarkMode} 
                    className="flex items-center space-x-2 w-full py-2 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                  >
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Constituent Circle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
