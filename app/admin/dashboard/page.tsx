'use client';

import { useAuth } from '../../../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ShieldCheckIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const adminUserInfo = useQuery(api.auth.checkAdminUser);
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Welcome to the admin dashboard. You are logged in as an administrator.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h3 className="font-medium">Admin Status</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.role === 'admin' ? 'Active Administrator' : 'Checking status...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h3 className="font-medium">Admin Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <KeyIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <h3 className="font-medium">Password Status</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {adminUserInfo?.hasPassword ? 'Password Set' : 'No Password Set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Use these tools to manage your admin account and system settings.
        </p>
        
        <div className="flex space-x-4 mt-4">
          <Link 
            href="/admin/tools" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Admin Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
