import AnalyticsPageLoader from '@/components/dashboard/analytics/AnalyticsPageLoader';

// This page remains a Server Component.
// It now renders the client-side Loader component.
export default function AnalyticsPage() {
  // Render the client-side Loader component.
  return <AnalyticsPageLoader />;
}