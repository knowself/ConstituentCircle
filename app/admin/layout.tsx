'use client';

import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useAuth } from '@/context/AuthContext'; // Use alias

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  // Show loading indicator while authentication state is resolving
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading Admin Area...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminHeader user={user} />
        <main className={`flex-1 ${inter.className}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}