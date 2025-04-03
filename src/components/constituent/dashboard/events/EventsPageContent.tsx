'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjusted import path
import ConstituentDashboardLayout from '@/components/constituent/ConstituentDashboardLayout'; // Adjusted import path
import Link from 'next/link';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Define Event type locally based on mock data structure
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  category: string;
  host: string;
  attendees: number;
  maxAttendees?: number;
  isVirtual: boolean;
  virtualLink?: string;
  isRSVPRequired: boolean;
  hasRSVPed: boolean;
  image?: string;
}

export default function EventsPageContent() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data - in a real app, this would come from Convex
  // Keep mock data for now, but acknowledge it needs replacement
  const [events, setEvents] = useState<Event[]>(
    [
      {
        id: '1',
        title: 'Town Hall Meeting: Infrastructure Bill',
        description: 'Join Rep. Jane Smith for a discussion on the upcoming infrastructure bill and how it will affect our district. There will be time for questions and feedback from constituents.',
        date: new Date('2025-03-20T18:00:00'),
        endDate: new Date('2025-03-20T20:00:00'),
        location: 'City Hall, 123 Main St, Springfield, IL',
        category: 'Town Hall',
        host: 'Rep. Jane Smith',
        attendees: 45,
        maxAttendees: 100,
        isVirtual: false,
        virtualLink: '',
        isRSVPRequired: true,
        hasRSVPed: false,
        image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: '2',
        title: 'Virtual Q&A: Education Funding',
        description: 'A virtual session to discuss the state of education funding in our district. Rep. Jane Smith will be joined by the Superintendent of Schools to answer your questions.',
        date: new Date('2025-03-25T12:00:00'),
        endDate: new Date('2025-03-25T13:00:00'),
        location: 'Online',
        category: 'Virtual Event',
        host: 'Rep. Jane Smith & Dr. Robert Johnson',
        attendees: 78,
        maxAttendees: 200,
        isVirtual: true,
        virtualLink: 'https://zoom.us/j/123456789',
        isRSVPRequired: true,
        hasRSVPed: true,
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: '3',
        title: 'Community Clean-up Day',
        description: 'Join us for a day of community service as we clean up Springfield Park. Supplies will be provided, but please bring your own water bottle and wear appropriate clothing.',
        date: new Date('2025-04-05T09:00:00'),
        endDate: new Date('2025-04-05T13:00:00'),
        location: 'Springfield Park, Springfield, IL',
        category: 'Community Service',
        host: 'Office of Rep. Jane Smith & Springfield Parks Department',
        attendees: 32,
        maxAttendees: 50,
        isVirtual: false,
        virtualLink: '',
        isRSVPRequired: true,
        hasRSVPed: true,
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: '4',
        title: 'Senior Citizens Resource Fair',
        description: 'A resource fair for senior citizens in our district. Learn about available services, Medicare updates, and meet with representatives from various agencies.',
        date: new Date('2025-04-10T10:00:00'),
        endDate: new Date('2025-04-10T15:00:00'),
        location: 'Springfield Community Center, 456 Oak St, Springfield, IL',
        category: 'Resource Fair',
        host: 'Office of Rep. Jane Smith & Department of Aging',
        attendees: 65,
        maxAttendees: 150,
        isVirtual: false,
        virtualLink: '',
        isRSVPRequired: false,
        hasRSVPed: false,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: '5',
        title: 'Legislative Update Webinar',
        description: 'Join Rep. Jane Smith for a webinar on recent legislative updates and how they affect our district. There will be a Q&A session at the end.',
        date: new Date('2025-03-15T17:00:00'),
        endDate: new Date('2025-03-15T18:30:00'),
        location: 'Online',
        category: 'Virtual Event',
        host: 'Rep. Jane Smith',
        attendees: 120,
        maxAttendees: 300,
        isVirtual: true,
        virtualLink: 'https://zoom.us/j/987654321',
        isRSVPRequired: true,
        hasRSVPed: true,
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80'
      }
    ]
  );

  const categories = Array.from(new Set(events.map(event => event.category)));

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredEvents = events.filter(event => {
    const today = new Date();

    // Filter by date
    if (activeFilter === 'upcoming' && event.date < today) {
      return false;
    }
    if (activeFilter === 'past' && event.date >= today) {
      return false;
    }

    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(event.category)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.host.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleRSVP = (eventId: string) => {
    // In a real app, you would update this in your Convex database
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        hasRSVPed: !updatedEvents[eventIndex].hasRSVPed,
      };
      setEvents(updatedEvents); // Update the state
    }
  };

  if (!mounted) {
    // Render loading state or null while waiting for the client-side mount
    return <ConstituentDashboardLayout><div>Loading...</div></ConstituentDashboardLayout>;
  }

  return (
    <ConstituentDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header and Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Events</h2>
              <p className="text-gray-600 dark:text-gray-300">Stay informed about upcoming events in your district.</p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <FunnelIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Section (Collapsible) */}
          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedCategories.includes(category)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Event Type Tabs */}
        <div className="mb-4">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveFilter('upcoming')}
                  className={`${activeFilter === 'upcoming'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveFilter('past')}
                  className={`${activeFilter === 'past'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Past Events
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col sm:flex-row">
                {event.image && (
                  <div className="sm:w-1/3 h-48 sm:h-auto flex-shrink-0">
                    <img className="w-full h-full object-cover" src={event.image} alt={event.title} />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.category === 'Town Hall' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                        event.category === 'Virtual Event' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        event.category === 'Community Service' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}
                      `}>
                        {event.category}
                      </span>
                      {event.isVirtual && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Virtual Event</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{formatTime(event.date)} {event.endDate && `- ${formatTime(event.endDate)}`}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>{event.attendees} / {event.maxAttendees ? event.maxAttendees : '∞'} Attendees</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {event.isRSVPRequired ? (
                      <button
                        onClick={() => handleRSVP(event.id)}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${event.hasRSVPed
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {event.hasRSVPed ? <XMarkIcon className="-ml-0.5 mr-1.5 h-4 w-4" /> : <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4" />}
                        {event.hasRSVPed ? 'Cancel RSVP' : 'RSVP Now'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">RSVP not required</span>
                    )}
                    {(event.isVirtual && event.virtualLink) || (!event.isVirtual) ? (
                        <Link href={(event.isVirtual ? event.virtualLink : `/events/${event.id}`) ?? '#'} target={event.isVirtual ? "_blank" : "_self"} rel={event.isVirtual ? "noopener noreferrer" : ""}>
                        <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                            {event.isVirtual ? 'Join Virtual Event' : 'View Details'}
                            <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                        </span>
                        </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No events match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}
