'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import ConstituentDashboardLayout from '@/components/constituent/ConstituentDashboardLayout'; 
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
import LoadingSpinner from '@/components/LoadingSpinner'; 

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
  updates: IssueUpdate[];
}

interface IssueUpdate {
  id: string;
  content: string;
  timestamp: number; 
  author: string;
  authorRole: 'constituent' | 'representative';
}

export default function IssuesPageContent() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  // Mock data - kept here for now, will eventually fetch from Convex
  const issues: Issue[] = [
    {
      id: '1',
      title: 'Pothole on Main Street needs repair',
      description: 'Large pothole at Main & Oak, causing damage.',
      category: 'Infrastructure',
      status: 'open',
      priority: 'medium',
      createdAt: new Date('2025-03-01').getTime(),
      updatedAt: new Date('2025-03-10').getTime(),
      location: '123 Main St, Springfield, IL',
      assignedTo: 'Public Works Department',
      updates: [
        { id: '1a', content: 'Submitted', timestamp: new Date('2025-03-01').getTime(), author: 'You', authorRole: 'constituent' },
        { id: '1b', content: 'Reviewed, forwarded to PWD', timestamp: new Date('2025-03-05').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '1c', content: 'Repairs scheduled', timestamp: new Date('2025-03-10').getTime(), author: 'Rep. Smith', authorRole: 'representative' }
      ]
    },
    {
      id: '2',
      title: 'Streetlight out on Cedar Lane',
      description: 'Streetlight out at Cedar & Pine, safety hazard.',
      category: 'Public Safety',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-03-05').getTime(),
      updatedAt: new Date('2025-03-12').getTime(),
      location: 'Cedar Lane & Pine St, Springfield, IL',
      assignedTo: 'Utilities Department',
      updates: [
        { id: '2a', content: 'Submitted', timestamp: new Date('2025-03-05').getTime(), author: 'You', authorRole: 'constituent' },
        { id: '2b', content: 'Reviewed, high priority', timestamp: new Date('2025-03-07').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '2c', content: 'Utilities notified', timestamp: new Date('2025-03-12').getTime(), author: 'Rep. Smith', authorRole: 'representative' }
      ]
    },
    {
      id: '3',
      title: 'Need more funding for local library',
      description: 'Library facing budget cuts, needs support.',
      category: 'Education',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date('2025-02-15').getTime(),
      updatedAt: new Date('2025-03-08').getTime(),
      location: 'Springfield Public Library',
      assignedTo: 'Education Committee',
      updates: [
        { id: '3a', content: 'Submitted', timestamp: new Date('2025-02-15').getTime(), author: 'You', authorRole: 'constituent' },
        { id: '3b', content: 'Reviewed, added to agenda', timestamp: new Date('2025-02-20').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '3c', content: 'Committee approved funding', timestamp: new Date('2025-03-05').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '3d', content: 'Budget passed, funding secured', timestamp: new Date('2025-03-08').getTime(), author: 'Rep. Smith', authorRole: 'representative' }
      ]
    },
    {
      id: '4',
      title: 'Noise complaint about construction',
      description: 'Construction starting too early (6 AM).',
      category: 'Noise',
      status: 'open',
      priority: 'low',
      createdAt: new Date('2025-03-14').getTime(),
      updatedAt: new Date('2025-03-14').getTime(),
      location: 'Elm Street Construction Site',
      assignedTo: 'Unassigned',
      updates: [
        { id: '4a', content: 'Submitted', timestamp: new Date('2025-03-14').getTime(), author: 'You', authorRole: 'constituent' }
      ]
    },
    {
      id: '5',
      title: 'Need crosswalk at busy intersection',
      description: 'Maple & Oak intersection needs crosswalk for safety.',
      category: 'Infrastructure',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-02-28').getTime(),
      updatedAt: new Date('2025-03-15').getTime(),
      location: 'Maple Ave & Oak St, Springfield, IL',
      assignedTo: 'Transportation Department',
      updates: [
        { id: '5a', content: 'Submitted', timestamp: new Date('2025-02-28').getTime(), author: 'You', authorRole: 'constituent' },
        { id: '5b', content: 'Reviewed, forwarded to Transp. Dept.', timestamp: new Date('2025-03-02').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '5c', content: 'Traffic study confirmed need', timestamp: new Date('2025-03-10').getTime(), author: 'Rep. Smith', authorRole: 'representative' },
        { id: '5d', content: 'Funding approved, construction soon', timestamp: new Date('2025-03-15').getTime(), author: 'Rep. Smith', authorRole: 'representative' }
      ]
    }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = activeFilter === 'all' || issue.status === activeFilter;
    const matchesSearch = 
      !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusInfo = (status: 'open' | 'in_progress' | 'resolved') => {
    switch (status) {
      case 'open':
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />,
          text: 'Open'
        };
      case 'in_progress':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: <ArrowPathIcon className="h-4 w-4 mr-1.5" />,
          text: 'In Progress'
        };
      case 'resolved':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: <CheckCircleIcon className="h-4 w-4 mr-1.5" />,
          text: 'Resolved'
        };
    }
  };

  if (!mounted || isLoading) { 
    return (
      <ConstituentDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ConstituentDashboardLayout>
    );
  }

  if (!user) {
    return (
      <ConstituentDashboardLayout>
        <p>Please log in to view your issues.</p>
      </ConstituentDashboardLayout>
    );
  }

  return (
    <ConstituentDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reported Issues</h1>
        <Link href="/constituent/dashboard/issues/new">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Report New Issue
          </button>
        </Link>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 flex-wrap justify-center md:justify-end">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 hidden sm:inline">Filter by:</span>
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-md flex items-center ${activeFilter === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FunnelIcon className="h-4 w-4 mr-1 opacity-50" /> All
            </button>
            <button 
              onClick={() => setActiveFilter('open')}
              className={`px-3 py-1 text-sm rounded-md flex items-center ${activeFilter === 'open' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-1 opacity-50" /> Open
            </button>
            <button 
              onClick={() => setActiveFilter('in_progress')}
              className={`px-3 py-1 text-sm rounded-md flex items-center ${activeFilter === 'in_progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1 opacity-50" /> In Progress
            </button>
            <button 
              onClick={() => setActiveFilter('resolved')}
              className={`px-3 py-1 text-sm rounded-md flex items-center ${activeFilter === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1 opacity-50" /> Resolved
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {filteredIssues.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIssues.map((issue) => {
              const statusInfo = getStatusInfo(issue.status);
              return (
                <li key={issue.id}>
                  <Link href={`/constituent/dashboard/issues/${issue.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                          {issue.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                            {statusInfo.text}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <ExclamationTriangleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            Priority: {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            Reported: {formatDate(issue.createdAt)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center px-4 py-8 sm:px-6">
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </ConstituentDashboardLayout>
  );
}
