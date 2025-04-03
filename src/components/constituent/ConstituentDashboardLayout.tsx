'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import dynamic from 'next/dynamic'; // Import dynamic
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  BellIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Dynamically import ProtectedRoute only on the client-side
const ProtectedRoute = dynamic(() => import('../auth/ProtectedRoute'), { ssr: false });

interface ConstituentDashboardLayoutProps {
  children: ReactNode;
}

export default function ConstituentDashboardLayout({ children }: ConstituentDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Example count
  
  // Handle hydration mismatch by only rendering user-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      router.push('/constituent/login?logout=true&message=You have been successfully logged out.');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/constituent/dashboard', icon: HomeIcon },
    { name: 'Messages', href: '/constituent/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Community Groups', href: '/constituent/dashboard/groups', icon: UserGroupIcon },
    { name: 'Legislation', href: '/constituent/dashboard/legislation', icon: DocumentTextIcon },
    { name: 'Notifications', href: '/constituent/dashboard/notifications', icon: BellIcon, badge: unreadNotifications },
    { name: 'District Resources', href: '/constituent/dashboard/resources', icon: MapPinIcon },
    { name: 'My Issues', href: '/constituent/dashboard/issues', icon: ClipboardDocumentListIcon },
    { name: 'My Profile', href: '/constituent/dashboard/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/constituent/dashboard/settings', icon: Cog6ToothIcon },
  ];

  // If not mounted yet, return a minimal layout to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col ml-0">
          <header className="bg-white shadow dark:bg-gray-800">
            <div className="flex h-16 items-center justify-between px-4"></div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
            {/* Don't render children during server-side rendering to prevent hydration issues */}
          </main>
        </div>
      </div>
    );
  }

  // If no user is available yet, show a loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} dark:bg-blue-900`}>
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-16 items-center justify-between px-4">
              <div className="text-xl font-bold text-white">Constituent Circle</div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <span className="sr-only">Close sidebar</span>
                {/* X icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'} dark:hover:bg-blue-800`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-800 dark:text-red-100">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* Logout button */}
              <button
                onClick={handleSignOut}
                className="w-full mt-4 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </nav>
        
            {/* User profile */}
            <div className="mt-auto p-4 border-t border-blue-600 dark:border-blue-800">
              <Link href="/constituent/dashboard/profile" className="group -m-2 flex items-center rounded-md p-2">
                {/* Use avatar_url or initials */}
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User avatar" className="mr-3 h-8 w-8 rounded-full" />
                ) : (
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-700">
                    <span className="text-xs font-medium leading-none text-white">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                        : user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </span>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.name || 'Your Account'}
                  </p>
                  <p className="text-xs text-blue-200 truncate">
                    {user?.email || 'Loading...'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex flex-col ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          {/* Top header */}
          <header className="bg-white shadow dark:bg-gray-800">
            <div className="flex h-16 items-center justify-between px-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${isSidebarOpen ? 'hidden md:hidden' : 'block'}`}
              >
                <span className="sr-only">Open sidebar</span>
                {/* Menu icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {navigation.find(item => typeof window !== 'undefined' && window.location.pathname === item.href)?.name || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notification bell */}
                <Link href="/constituent/dashboard/notifications" className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <BellIcon className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle dark:bg-gray-800">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Sign out of your account?</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You will need to sign in again to access your dashboard and messages.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm dark:bg-red-700 dark:hover:bg-red-800"
                  onClick={confirmLogout}
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
