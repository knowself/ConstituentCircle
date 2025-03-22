'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  UsersIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  BellAlertIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'User Management', href: '/admin/dashboard/users', icon: UsersIcon, badge: 3 },
  { name: 'Representatives', href: '/admin/dashboard/representatives', icon: BuildingOfficeIcon },
  { name: 'System Health', href: '/admin/dashboard/system', icon: ShieldCheckIcon },
  { name: 'Reports', href: '/admin/dashboard/reports', icon: DocumentTextIcon },
  { name: 'Notifications', href: '/admin/dashboard/notifications', icon: BellAlertIcon, badge: 5 },
  { name: 'Admin Tools', href: '/admin/tools', icon: WrenchScrewdriverIcon },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, confirmLogout } = useAuth();

  return (
    <div className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">Admin Panel</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-2 py-2 rounded-md ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && (
                    <span className="ml-3 flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="border-t border-gray-700 p-4">
        {!collapsed ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">View Profile</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                confirmLogout();
              }}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              confirmLogout();
            }}
            className="flex items-center justify-center w-full p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
