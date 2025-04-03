'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming this path is correct

const DashboardPageContent = dynamic(
  () => import('@/components/dashboard/overview/DashboardPageContent'), // Adjust path if necessary
  {
    ssr: false,
    loading: () => (
      // Basic loading state for the dashboard overview
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    ),
  }
);

export default function DashboardPageLoader() {
  return <DashboardPageContent />;
}
