'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from '../../../../components/constituent/ConstituentDashboardLayout';
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

export default function IssuesPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
      description: 'Our local library is facing budget cuts that will reduce hours and services. This is a vital community resource that needs more funding, not less.',
      category: 'Education',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date('2025-02-15').getTime(),
      updatedAt: new Date('2025-03-08').getTime(),
      location: 'Springfield Public Library, Springfield, IL',
      assignedTo: 'Education Committee',
      updates: [
        {
          id: '3a',
          content: 'Issue submitted',
          timestamp: new Date('2025-02-15').getTime(),
          author: 'You',
          authorRole: 'constituent'
        },
        {
          id: '3b',
          content: 'Issue has been reviewed and added to the agenda for the next Education Committee meeting',
          timestamp: new Date('2025-02-20').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '3c',
          content: 'Education Committee has approved additional funding for the library in the next budget cycle',
          timestamp: new Date('2025-03-05').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '3d',
          content: 'Budget amendment has been passed, securing funding for the library for the next fiscal year',
          timestamp: new Date('2025-03-08').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        }
      ]
    },
    {
      id: '4',
      title: 'Noise complaint about construction',
      description: 'Construction on the new apartment building on Elm Street is starting at 6:00 AM, which is earlier than the city ordinance allows. This has been disrupting sleep for many residents.',
      category: 'Noise',
      status: 'open',
      priority: 'low',
      createdAt: new Date('2025-03-14').getTime(),
      updatedAt: new Date('2025-03-14').getTime(),
      location: 'Elm Street Construction Site, Springfield, IL',
      assignedTo: 'Unassigned',
      updates: [
        {
          id: '4a',
          content: 'Issue submitted',
          timestamp: new Date('2025-03-14').getTime(),
          author: 'You',
          authorRole: 'constituent'
        }
      ]
    },
    {
      id: '5',
      title: 'Need crosswalk at busy intersection',
      description: 'The intersection of Maple Avenue and Oak Street is very busy and dangerous for pedestrians. We need a crosswalk with signals to ensure safety, especially for children walking to school.',
      category: 'Infrastructure',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-02-28').getTime(),
      updatedAt: new Date('2025-03-15').getTime(),
      location: 'Intersection of Maple Avenue and Oak Street, Springfield, IL',
      assignedTo: 'Transportation Department',
      updates: [
        {
          id: '5a',
          content: 'Issue submitted',
          timestamp: new Date('2025-02-28').getTime(),
          author: 'You',
          authorRole: 'constituent'
        },
        {
          id: '5b',
          content: 'Issue has been reviewed and forwarded to the Transportation Department',
          timestamp: new Date('2025-03-02').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '5c',
          content: 'Transportation Department has conducted a traffic study and confirmed the need for a crosswalk',
          timestamp: new Date('2025-03-10').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        },
        {
          id: '5d',
          content: 'Funding has been approved for the crosswalk installation. Construction will begin next month.',
          timestamp: new Date('2025-03-15').getTime(),
          author: 'Rep. Jane Smith',
          authorRole: 'representative'
        }
      ]
    }
  ];
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredIssues = issues.filter(issue => {
    // Filter by status
    if (activeFilter !== 'all' && issue.status !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <ArrowPathIcon className="mr-1 h-3 w-3" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <ConstituentDashboardLayout>
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                My Issues
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track and manage issues you've submitted to your representative.
              </p>
            </div>
            <Link
              href="/constituent/dashboard/issues/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Issue
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Filters and search */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('open')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'open' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Open
              </button>
              <button
                onClick={() => setActiveFilter('in_progress')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveFilter('resolved')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Resolved
              </button>
            </div>
            <div className="mt-3 sm:mt-0">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  placeholder="Search issues"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Issues list */}
          <div className="overflow-x-auto">
            {filteredIssues.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Issue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Last Updated
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {issue.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{issue.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(issue.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(issue.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(issue.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/constituent/dashboard/issues/${issue.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                          <ChevronRightIcon className="ml-1 h-4 w-4 inline" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <ExclamationTriangleIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search or filter criteria.' : 'Get started by creating a new issue.'}
                </p>
                {!searchQuery && (
                  <div className="mt-6">
                    <Link
                      href="/constituent/dashboard/issues/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Issue
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
