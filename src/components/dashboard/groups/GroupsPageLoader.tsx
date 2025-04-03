'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming this path is correct

const GroupsPageContent = dynamic(
  () => import('@/components/dashboard/groups/GroupsPageContent'), // Adjust path if necessary
  {
    ssr: false,
    loading: () => (
      // Basic loading state, can be customized
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    ),
  }
);

export default function GroupsPageLoader() {
  return <GroupsPageContent />;
}
