'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from '../../../../components/constituent/ConstituentDashboardLayout';
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

export default function EventsPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Mock data - in a real app, this would come from Convex
  const events: Event[] = [
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
  ];
  
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
    // In a real app, you would update this in your database
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.hasRSVPed = !event.hasRSVPed;
      // Force a re-render
      setEvents([...events]);
    }
  };

  // This is just for the mock implementation
  const setEvents = (newEvents: Event[]) => {
    // In a real app, this would update the state
    console.log('Events updated:', newEvents);
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
                Events
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Stay informed about upcoming events in your district.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Filters and search */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter('upcoming')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveFilter('past')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeFilter === 'past' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  Past
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}
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
                    placeholder="Search events"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Category filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by category:</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${selectedCategories.includes(category) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                      {category}
                      {selectedCategories.includes(category) ? (
                        <XMarkIcon className="ml-1 h-4 w-4" />
                      ) : (
                        <PlusIcon className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Events grid */}
          <div className="p-4">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {event.image && (
                      <div className="h-40 w-full overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {event.category}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(event.date)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(event.date)} - {formatTime(event.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {event.location}
                            {event.isVirtual && (
                              <span className="ml-1 text-blue-600 dark:text-blue-400">
                                <Link href={event.virtualLink} target="_blank" className="inline-flex items-center">
                                  Join online <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3" />
                                </Link>
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div className="flex items-start">
                          <UserGroupIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {event.attendees} attending ({Math.round((event.attendees / event.maxAttendees) * 100)}% full)
                          </p>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <Link 
                          href={`/constituent/dashboard/events/${event.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View details
                        </Link>
                        
                        {event.isRSVPRequired && event.date > new Date() && (
                          <button
                            onClick={() => handleRSVP(event.id)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${event.hasRSVPed ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'}`}
                          >
                            {event.hasRSVPed ? (
                              <>
                                <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                                RSVP'd
                              </>
                            ) : 'RSVP'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <CalendarIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedCategories.length > 0 ? 'Try adjusting your search or filter criteria.' : activeFilter === 'upcoming' ? 'There are no upcoming events scheduled at this time.' : 'There are no past events to display.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}

// Helper component for the plus icon
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location: string;
  category: string;
  host: string;
  attendees: number;
  maxAttendees: number;
  isVirtual: boolean;
  virtualLink: string;
  isRSVPRequired: boolean;
  hasRSVPed: boolean;
  image?: string;
}
