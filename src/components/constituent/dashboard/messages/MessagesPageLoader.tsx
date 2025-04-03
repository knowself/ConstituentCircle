'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming this path is correct

const MessagesPageContent = dynamic(
  () => import('@/components/constituent/dashboard/messages/MessagesPageContent'), // Adjust path if necessary
  {
    ssr: false,
    loading: () => (
      // You might want a more specific loading state for the messages layout
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    ),
  }
);

export default function MessagesPageLoader() {
  return <MessagesPageContent />;
}
