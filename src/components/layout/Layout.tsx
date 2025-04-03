import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import CustomHead from './Head';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon as ChatIcon, 
  ChartBarIcon, 
  Cog6ToothIcon as CogIcon,
  XMarkIcon as XIcon,
  UserIcon,
  Bars3Icon as MenuIcon,
  ArrowRightOnRectangleIcon as LogoutIcon
} from '@heroicons/react/24/solid';
import Navigation from '../Navigation';
import TestNavigation from '../TestNavigation';
import Footer from '../Footer';
import { UserDoc } from '../../../convex/types';

interface LayoutProps {
  children: ReactNode;
}

// Define navigation item type
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Handle ESC key to close mobile menu
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen]);

  // Add event listener for keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Check if a link is active - moved outside of JSX
  const isActiveLink = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  // Type the user properly when logging
  console.log('Auth state:', { user: user as UserDoc | null, isAuthenticated: !!user });

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/signin');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Communications', href: '/dashboard/communications', icon: ChatIcon },
    { name: 'Constituents', href: '/dashboard/constituents', icon: UserGroupIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
    { name: 'Auth', href: '/auth', icon: UserIcon },
  ];

  // Non-authenticated layout
  if (!user) {
    console.log('Rendering non-authenticated layout with Navigation');
    return (
      <div className="min-h-screen">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    );
  }

  // Authenticated user layout
  return (
    <div className="min-h-screen">
      {/* Remove the user prop since Navigation doesn't accept it */}
      <Navigation />
      <div className="bg-gray-100 min-h-screen">
        <CustomHead />
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            type="button"
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        <div 
          className="lg:hidden"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="fixed inset-0 flex z-40">
            <div
              className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            />

            <div
              className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ease-in-out duration-300 ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="pt-5 pb-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold">Menu</div>
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <XIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-5">
                  <nav className="grid gap-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center p-2 -m-2 rounded-md hover:bg-gray-100 ${
                          isActiveLink(item.href) ? 'bg-gray-100 text-blue-600' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon 
                          className={`h-6 w-6 mr-3 ${
                            isActiveLink(item.href) ? 'text-blue-600' : 'text-gray-600'
                          }`} 
                          aria-hidden="true" 
                        />
                        <span className={`text-base font-medium ${
                          isActiveLink(item.href) ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 -m-2 rounded-md hover:bg-gray-100 w-full"
                  >
                    <LogoutIcon className="h-6 w-6 text-gray-600 mr-3" aria-hidden="true" />
                    <span className="text-base font-medium text-gray-900">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
