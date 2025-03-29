'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from 'src/components/constituent/ConstituentDashboardLayout';
import Link from 'next/link';
import { 
  BellIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Mock data - in a real app, this would come from Convex
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New message from Rep. Jane Smith',
      content: 'You have received a new message regarding your infrastructure question.',
      type: 'message',
      isRead: false,
      timestamp: new Date('2025-03-15T14:30:00').getTime(),
      link: '/constituent/dashboard/messages',
      relatedId: 'msg123'
    },
    {
      id: '2',
      title: 'Town Hall Meeting Reminder',
      content: 'Reminder: Town Hall Meeting on Infrastructure Bill tomorrow at 6:00 PM at City Hall.',
      type: 'event',
      isRead: true,
      timestamp: new Date('2025-03-19T09:00:00').getTime(),
      link: '/constituent/dashboard/events/1',
      relatedId: 'event1'
    },
    {
      id: '3',
      title: 'Issue status updated',
      content: 'Your issue "Pothole on Main Street" has been updated to "In Progress".',
      type: 'issue',
      isRead: false,
      timestamp: new Date('2025-03-10T11:15:00').getTime(),
      link: '/constituent/dashboard/issues/1',
      relatedId: 'issue1'
    },
    {
      id: '4',
      title: 'New legislation alert',
      content: 'Rep. Jane Smith has introduced a new bill on education funding that may interest you.',
      type: 'legislation',
      isRead: true,
      timestamp: new Date('2025-03-08T16:45:00').getTime(),
      link: '/constituent/dashboard/legislation',
      relatedId: 'bill456'
    },
    {
      id: '5',
      title: 'Community survey available',
      content: 'A new survey on local transportation needs is available. Your input is valuable!',
      type: 'announcement',
      isRead: false,
      timestamp: new Date('2025-03-05T10:30:00').getTime(),
      link: '/constituent/dashboard/surveys',
      relatedId: 'survey789'
    },
    {
      id: '6',
      title: 'Issue resolved',
      content: 'Your issue "Need more funding for local library" has been marked as resolved.',
      type: 'issue',
      isRead: true,
      timestamp: new Date('2025-03-08T15:20:00').getTime(),
      link: '/constituent/dashboard/issues/3',
      relatedId: 'issue3'
    },
    {
      id: '7',
      title: 'New virtual event added',
      content: 'Rep. Jane Smith has scheduled a Virtual Q&A on Education Funding for March 25.',
      type: 'event',
      isRead: false,
      timestamp: new Date('2025-03-12T13:10:00').getTime(),
      link: '/constituent/dashboard/events/2',
      relatedId: 'event2'
    }
  ];
  
  // Notification preferences - in a real app, this would come from Convex
  const [preferences, setPreferences] = useState({
    email: true,
    push: false,
    sms: false,
    frequency: 'immediate',
    types: {
      message: true,
      event: true,
      issue: true,
      legislation: true,
      announcement: true
    }
  });
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'unread' && notification.isRead) {
      return false;
    }
    if (activeFilter !== 'all' && activeFilter !== 'unread' && notification.type !== activeFilter) {
      return false;
    }
    return true;
  });

  const markAsRead = (id: string) => {
    // In a real app, you would update this in your database
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      // Force a re-render
      setNotifications([...notifications]);
    }
  };

  const markAllAsRead = () => {
    // In a real app, you would update this in your database
    notifications.forEach(notification => {
      notification.isRead = true;
    });
    // Force a re-render
    setNotifications([...notifications]);
  };

  const deleteNotification = (id: string) => {
    // In a real app, you would update this in your database
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
      // Force a re-render
      setNotifications([...notifications]);
    }
  };

  const updatePreference = (key: string, value: boolean | string) => {
    // In a real app, you would update this in your database
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const parentKey = parent as keyof typeof preferences;
      const parentValue = preferences[parentKey];
      
      setPreferences({
        ...preferences,
        [parent]: {
          ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
          [child]: value
        }
      });
    } else {
      setPreferences({
        ...preferences,
        [key]: value
      });
    }
  };

  // This is just for the mock implementation
  const setNotifications = (newNotifications: Notification[]) => {
    // In a real app, this would update the state
    console.log('Notifications updated:', newNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case 'issue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'legislation':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'announcement':
        return <MegaphoneIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
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
                Notifications
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Stay updated on messages, events, and issues.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                disabled={!notifications.some(n => !n.isRead)}
              >
                <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                Mark all as read
              </button>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <BellIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                Preferences
              </button>
            </div>
          </div>
        </div>
        
        {/* Notification preferences */}
        {showPreferences && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Methods</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="email"
                      name="email"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.email}
                      onChange={(e) => updatePreference('email', e.target.checked)}
                    />
                    <label htmlFor="email" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push"
                      name="push"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.push}
                      onChange={(e) => updatePreference('push', e.target.checked)}
                    />
                    <label htmlFor="push" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Push notifications (browser)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="sms"
                      name="sms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.sms}
                      onChange={(e) => updatePreference('sms', e.target.checked)}
                    />
                    <label htmlFor="sms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      SMS notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</h4>
                <div className="mt-1">
                  <select
                    id="frequency"
                    name="frequency"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={preferences.frequency}
                    onChange={(e) => updatePreference('frequency', e.target.value)}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="message"
                      name="message"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.types.message}
                      onChange={(e) => updatePreference('types.message', e.target.checked)}
                    />
                    <label htmlFor="message" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Messages
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="event"
                      name="event"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.types.event}
                      onChange={(e) => updatePreference('types.event', e.target.checked)}
                    />
                    <label htmlFor="event" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Events
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="issue"
                      name="issue"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.types.issue}
                      onChange={(e) => updatePreference('types.issue', e.target.checked)}
                    />
                    <label htmlFor="issue" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Issues
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="legislation"
                      name="legislation"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.types.legislation}
                      onChange={(e) => updatePreference('types.legislation', e.target.checked)}
                    />
                    <label htmlFor="legislation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Legislation
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="announcement"
                      name="announcement"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={preferences.types.announcement}
                      onChange={(e) => updatePreference('types.announcement', e.target.checked)}
                    />
                    <label htmlFor="announcement" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Announcements
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => setShowPreferences(false)}
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'unread' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Unread
              </button>
              <button
                onClick={() => setActiveFilter('message')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'message' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveFilter('event')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveFilter('issue')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'issue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Issues
              </button>
              <button
                onClick={() => setActiveFilter('legislation')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'legislation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Legislation
              </button>
              <button
                onClick={() => setActiveFilter('announcement')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'announcement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                Announcements
              </button>
            </div>
          </div>
          
          {/* Notifications list */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 ${notification.isRead ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {notification.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Link
                          href={notification.link}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View details
                        </Link>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeFilter !== 'all' ? 'Try selecting a different filter.' : 'You don\'t have any notifications at this time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}

// Types
interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'issue' | 'legislation' | 'announcement';
  isRead: boolean;
  timestamp: number;
  link: string;
  relatedId: string;
}
