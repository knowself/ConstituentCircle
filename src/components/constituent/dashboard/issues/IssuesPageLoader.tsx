'use client'; // This component must be a Client Component

import dynamic from 'next/dynamic';
import ConstituentDashboardLayout from '@/components/constituent/ConstituentDashboardLayout'; // Use alias
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming path

const IssuesPageContent = dynamic(
  () => import('@/components/constituent/dashboard/issues/IssuesPageContent'), // Adjust path if necessary
  {
    ssr: false,
    loading: () => (
      // Wrap loading state in the layout for consistency
      <ConstituentDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ConstituentDashboardLayout>
    ),
  }
);

export default function IssuesPageLoader() {
  return <IssuesPageContent />;
}
