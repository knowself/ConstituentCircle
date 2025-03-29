'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { useRouter } from 'next/navigation';
import Loading from 'src/components/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Rendering DashboardLayout');
  const { user, isLoading } = useAuth();
  console.log('AuthContext value:', { user, isLoading });
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    // Only run this effect on the client side
    if (!mounted) return;
    
    if (!user) {
      // No authenticated user, redirect to sign in
      console.log('No authenticated user, redirecting to sign in');
      router.push('/auth/signin');
    } else if (user.role === 'admin') {
      // Redirect admin users to admin dashboard
      console.log('Admin user detected, redirecting to admin dashboard');
      router.push('/admin/dashboard');
    }
  }, [user, mounted, router]);

  // During server-side rendering or before mounting, return a minimal placeholder
  // to prevent hydration mismatch
  if (!mounted) {
    return <div></div>;
  }
  
  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                  {user?.name || 'User'}
                </span>
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
  );
}
