import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// This is now a Server Component layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Rendering DashboardLayout (Server Component)');

  // Removed client-side auth checks and redirects.
  // Auth boundary is handled by the (protected) group and page loaders.

  return (
    <ErrorBoundary> {/* Keep ErrorBoundary if needed */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col">
          {/* TODO: Consider adding a shared dashboard sidebar/navigation here if applicable */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children} {/* Render the specific dashboard page */}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
