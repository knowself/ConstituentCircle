'use client';

import { useAuth } from '../../../context/AuthContext';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminHeader({ user }: { user: any }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={logout}
            className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}