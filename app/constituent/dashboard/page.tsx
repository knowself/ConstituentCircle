'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ConstituentDashboardLayout from '../../../components/constituent/ConstituentDashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ConstituentDashboard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Example data - in a real app, this would come from Convex
  const recentMessages = [
    { id: 1, title: 'Response to your infrastructure question', date: 'Mar 15, 2025', status: 'unread' },
    { id: 2, title: 'Town Hall Meeting Announcement', date: 'Mar 12, 2025', status: 'read' },
    { id: 3, title: 'Your feedback on the education bill', date: 'Mar 10, 2025', status: 'read' },
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Town Hall Meeting', date: 'Mar 20, 2025', time: '6:00 PM', location: 'City Hall' },
    { id: 2, title: 'Education Committee Hearing', date: 'Mar 25, 2025', time: '10:00 AM', location: 'State Capitol' },
    { id: 3, title: 'Community Clean-up Day', date: 'Apr 2, 2025', time: '9:00 AM', location: 'Central Park' },
  ];
  
  const issueStats = {
    submitted: 5,
    inProgress: 3,
    resolved: 8
  };
  
  // Mock representative data
  const representative = {
    name: 'Jane Smith',
    title: 'State Representative',
    district: 'District 42',
    party: 'Independent',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    contactInfo: {
      email: 'jane.smith@statehouse.gov',
      phone: '(555) 123-4567',
      office: '123 State Capitol Building'
    }
  };
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ConstituentDashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user?.metadata?.firstName || 'Constituent'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay connected with your representative and make your voice heard on issues that matter to you.
          </p>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Unread Messages</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{recentMessages.filter(m => m.status === 'unread').length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/constituent/dashboard/messages" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">View all messages</Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Upcoming Events</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{upcomingEvents.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/constituent/dashboard/events" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400">View calendar</Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Issues</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{issueStats.inProgress}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/constituent/dashboard/issues" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">Track your issues</Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                  <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Community Groups</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">3</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/constituent/dashboard/groups" className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400">View your groups</Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Your Representative */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Representative</h3>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                  <img src={representative.photoUrl} alt={representative.name} className="h-full w-full object-cover" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{representative.name}</h4>
                <p className="text-gray-500 dark:text-gray-400">{representative.title}</p>
                <p className="text-gray-500 dark:text-gray-400">{representative.district} • {representative.party}</p>
                <div className="mt-4 w-full space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{representative.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{representative.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Office:</span>
                    <span className="ml-2">{representative.contactInfo.office}</span>
                  </div>
                </div>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800">
                  Send Message
                </button>
              </div>
            </div>
          </div>
          
          {/* Recent Messages */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Messages</h3>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-2 ${message.status === 'unread' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${message.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {message.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{message.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
              <Link href="/constituent/dashboard/messages" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                View all messages
              </Link>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.date} at {event.time}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
              <Link href="/constituent/dashboard/events" className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400">
                View all events
              </Link>
            </div>
          </div>
        </div>
        
        {/* Issue Tracking */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Issues</h3>
              <Link href="/constituent/dashboard/issues/new" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                Submit New Issue
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Submitted</h4>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issueStats.submitted}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-2">
                    <ChartBarIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">In Progress</h4>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issueStats.inProgress}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-2">
                    <DocumentTextIcon className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Resolved</h4>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issueStats.resolved}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
            <Link href="/constituent/dashboard/issues" className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
              View all issues
            </Link>
          </div>
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}
