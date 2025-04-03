'use client'; // This component must be a Client Component

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner'; // Use the newly created spinner

// Dynamically import the actual content component with ssr: false
const AnalyticsPageContent = dynamic(
  () => import('@/components/dashboard/analytics/AnalyticsPageContent'),
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
export default function AnalyticsPageLoader() {
  return <AnalyticsPageContent />;
}
