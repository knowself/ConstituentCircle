'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { UsersIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const userCount = useQuery(api.users.countUsers) || 0;
  const contentCount = useQuery(api.content.countContent) || 0;
  const adminCount = useQuery(api.users.countAdmins) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Quick overview of your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Content Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{contentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Administrators</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{adminCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No recent activity</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
              <span>Create New User</span>
              <span className="text-gray-500">+</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
              <span>Manage Content</span>
              <span className="text-gray-500">→</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
              <span>View Reports</span>
              <span className="text-gray-500">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
