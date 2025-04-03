import EventsPageLoader from '@/components/constituent/dashboard/events/EventsPageLoader';

// This page remains a Server Component.
// It now renders the client-side Loader component.
export default function EventsPage() {
  return <EventsPageLoader />;
}