'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from 'src/components/constituent/ConstituentDashboardLayout';
import Link from 'next/link';
import { 
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Inner component that uses the auth context
const IssuesPageContent = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Return loading state if auth is still loading (after mount)
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading user data...</p> 
      </div>
    );
  }

  // Mock data - in a real app, this would come from Convex
  const issues: Issue[] = [
    {
      id: '1',
      title: 'Pothole on Main Street needs repair',
      description: 'There is a large pothole at the intersection of Main Street and Oak Avenue that has been causing damage to vehicles. It has been there for over a month.',
      category: 'Infrastructure',
      status: 'open',
      priority: 'medium',
      createdAt: new Date('2025-03-01').getTime(),
      updatedAt: new Date('2025-03-10').getTime(),
      location: '123 Main St, Springfield, IL',
      assignedTo: 'Public Works Department',
      updates: [
        {
          id: '1a',
          content: 'Issue submitted',
          timestamp: new Date('2025-03-01').getTime(),
          author: 'You',
          authorRole: 'constituent'
        },
        {
          id: '1b',
          content: 'Issue has been reviewed and forwarded to the Public Works Department',
          timestamp: new Date('2025-03-05').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '1c',
          content: 'Public Works Department has scheduled repairs for next week',
          timestamp: new Date('2025-03-10').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        }
      ]
    },
    {
      id: '2',
      title: 'Streetlight out on Cedar Lane',
      description: 'The streetlight at the corner of Cedar Lane and Pine Street has been out for two weeks, creating a safety hazard for pedestrians at night.',
      category: 'Public Safety',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-03-05').getTime(),
      updatedAt: new Date('2025-03-12').getTime(),
      location: 'Corner of Cedar Lane and Pine Street, Springfield, IL',
      assignedTo: 'Utilities Department',
      updates: [
        {
          id: '2a',
          content: 'Issue submitted',
          timestamp: new Date('2025-03-05').getTime(),
          author: 'You',
          authorRole: 'constituent'
        },
        {
          id: '2b',
          content: 'Issue has been reviewed and marked as high priority due to safety concerns',
          timestamp: new Date('2025-03-07').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '2c',
          content: 'Utilities Department has been notified and will dispatch a crew this week',
          timestamp: new Date('2025-03-12').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        }
      ]
    },
    {
      id: '3',
      title: 'Need more funding for local library',
      description: 'The Springfield Public Library is facing budget cuts and needs additional funding to maintain its current programs and services.',
      category: 'Community Development',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date('2025-03-10').getTime(),
      updatedAt: new Date('2025-03-20').getTime(),
      location: '456 Library Ave, Springfield, IL',
      assignedTo: 'City Council',
      updates: [
        {
          id: '3a',
          content: 'Issue submitted',
          timestamp: new Date('2025-03-10').getTime(),
          author: 'You',
          authorRole: 'constituent'
        },
        {
          id: '3b',
          content: 'Issue brought up at the last City Council meeting',
          timestamp: new Date('2025-03-15').getTime(),
          author: 'Rep. John Doe',
          authorRole: 'representative'
        },
        {
          id: '3c',
          content: 'City Council voted to allocate additional funds to the library',
          timestamp: new Date('2025-03-20').getTime(),
          author: 'Rep. John Doe',
          authorRole: 'representative'
        }
      ]
    }
  ];

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = activeFilter === 'all' || issue.status === activeFilter;
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <ExclamationTriangleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" aria-hidden="true" />
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ArrowPathIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" aria-hidden="true" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-400" aria-hidden="true" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400" aria-hidden="true" />
            Unknown
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Unknown
          </span>
        );
    }
  };

  return (
    <ConstituentDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Reported Issues</h1>
          <Link 
            href="/constituent/dashboard/issues/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Report New Issue
          </Link>
        </div>

        {/* Filter and Search Controls */}
        <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
            <div className="flex space-x-2">
              {[ 'all', 'open', 'in_progress', 'resolved' ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeFilter === filter ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex-grow max-w-xs w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <li key={issue.id}>
                  <Link href={`/constituent/dashboard/issues/${issue.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                          {issue.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                          {getStatusBadge(issue.status)}
                          {getPriorityBadge(issue.priority)}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Opened on {new Date(issue.createdAt).toLocaleDateString()}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {issue.location || 'Location not specified'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            Last updated: {new Date(issue.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by reporting a new issue.</p>
                  <div className="mt-6">
                    <Link 
                      href="/constituent/dashboard/issues/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Issue
                    </Link>
                  </div>
                </div>
              </li>
            )}
          </ul>
          
          {/* Pagination */}
          {filteredIssues.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{filteredIssues.length}</span> issues
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
};

// Main page component
export default function IssuesPage() {
  // State for client-side mounting check (prevents hydration errors with useEffect)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return loading state until component is mounted
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading issues...</p> 
      </div>
    );
  }

  // Render the actual content only after mounting
  return <IssuesPageContent />;
}

// Types
interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  updatedAt: number;
  location: string;
  assignedTo: string;
  updates: Array<{
    id: string;
    content: string;
    timestamp: number;
    author: string;
    authorRole: 'constituent' | 'representative';
  }>;
}
