'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from 'src/components/Loading';
import AdminSidebar from 'src/components/admin/AdminSidebar';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // This effect handles authentication checks and redirects
  React.useEffect(() => {
    // Only run this effect on the client side and when not already redirecting
    if (!mounted || isRedirecting) return;

    // No user means we need to redirect to login
    if (!user) {
      console.log('No authenticated user, redirecting to admin login');
      setIsRedirecting(true);
      window.location.replace('/admin/login');
      return;
    }
    
    // User exists but is not an admin
    if (user.role !== 'admin') {
      console.log(`User role ${user.role} is not admin, redirecting to dashboard`);
      setIsRedirecting(true);
      router.replace('/dashboard');
      return;
    }
  }, [user, mounted, router, isRedirecting]);

  // During server-side rendering or before mounting, return a minimal placeholder
  // to prevent hydration mismatch
  if (!mounted) {
    return <div></div>;
  }
  

  if (!user) {
    return <Loading size="medium" message="Redirecting to login..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                    {user?.name || user?.email?.split('@')[0] || 'Admin'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.replace('/admin/login');
                    }}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
