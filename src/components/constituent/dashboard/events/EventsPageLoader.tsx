'use client'; // This component must be a Client Component

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner'; // Ensure this path is correct

// Dynamically import the actual content component with ssr: false
const EventsPageContent = dynamic(
  () => import('@/components/constituent/dashboard/events/EventsPageContent'),
  {
    ssr: false, // ssr: false is allowed in Client Components
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    ),
  }
);

// This loader component simply renders the dynamically imported content
export default function EventsPageLoader() {
  return <EventsPageContent />;
}
