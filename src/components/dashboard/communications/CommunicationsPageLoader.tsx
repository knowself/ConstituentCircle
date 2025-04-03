'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CommunicationsPageContent = dynamic(
  () => import('@/components/dashboard/communications/CommunicationsPageContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    ),
  }
);

export default function CommunicationsPageLoader() {
  return <CommunicationsPageContent />;
}
