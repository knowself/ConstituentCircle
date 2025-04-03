'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DatabaseService } from '@root/lib/database/service'; // Use @root alias for root lib
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Communication, CommunicationType, CommunicationDirection, CommunicationChannel } from '../../../lib/types/communication';
import { Id } from '../../../convex/_generated/dataModel';

// Define the ConvexCommunication interface based on what Convex returns
interface ConvexCommunication {
  _id: Id<"communications">;
  _creationTime: number;
  createdAt: number;
  representativeId: Id<"users">;
  constituentId: Id<"constituents">;
  messageType: string;
  content: string;
  channel: string;
  status: string;
  sentAt: number;
}

// --- New Nested Client Component --- 
function DashboardContent() { 
  // --- Hooks --- 
  const { user, isLoading: authLoading, logout } = useAuth();

  // --- State for Data --- 
  const [recentCommunications, setRecentCommunications] = useState<Communication[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false); // Start as false, set true when fetching
  const [error, setError] = useState<string | null>(null);

  // --- Effects for Data Fetching --- 
  useEffect(() => {
    // Fetch data only if auth is *done loading* and user exists
    if (!authLoading && user?._id) { 
      setIsLoadingData(true); // Set loading true before fetch starts
      const dbService = new DatabaseService('communications');
      // Explicitly provide FilterType and ResultType generics
      dbService.query<{ representativeId: Id<"users">; limit: number }, ConvexCommunication>({ 
          representativeId: user._id as Id<"users">, 
          limit: 3 
        })
        .then(rawResults => {
          // Map Convex results to the Communication type used in the component
          const mappedComms = rawResults.map((result: ConvexCommunication) => ({
            id: String(result._id),
            subject: result.messageType || "", 
            content: result.content || "",
            type: (result.messageType as CommunicationType) || "direct",
            direction: "outbound" as CommunicationDirection, 
            channel: (result.channel as CommunicationChannel) || "email", 
            visibility: "public" as "public" | "private" | "group", 
            status: (result.status as "draft" | "sent" | "delivered" | "read") || "sent", 
            sentAt: result._creationTime, 
            createdAt: new Date(result._creationTime),
            updatedAt: new Date(result._creationTime) 
          }));
          // Sort by date descending (already limited to 3 by query)
          const sortedData = mappedComms.sort((a, b) => b.sentAt - a.sentAt);
          setRecentCommunications(sortedData);
          console.log('DashboardContent: Fetched Communications:', sortedData);
        })
        .catch(err => {
          console.error('DashboardContent: Error fetching communications:', err);
          setError(err instanceof Error ? err.message : 'Failed to load recent communications');
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else if (!authLoading && !user) {
      // If auth is done loading but there's no user, clear data and don't fetch
      setRecentCommunications([]);
      setIsLoadingData(false);
      console.log("DashboardContent: Auth loaded, no user, skipping data fetch.")
    }
    // If auth is still loading, do nothing, wait for it.
  }, [authLoading, user]); // Depend on auth loading state and user object

  // --- Loading State Handling --- 
  if (authLoading) {
    // Still waiting for the auth context itself to load
    console.log("DashboardContent: Waiting for auth initialization...");
    return <DashboardSkeleton showDataSections={false} />; 
  }

  // Auth is done loading, but no user object. Middleware *should* prevent this state
  // during initial load, but it might occur after logout.
  if (!user) {
    console.warn("DashboardContent: Auth loaded but no user object found.");
    // Render a logged-out state or potentially trigger a redirect if needed (though logout button might handle this)
    return (
      <div className="container mx-auto px-4 py-8">
        <p>You are logged out or your session is invalid.</p>
        {/* Optionally add a button to go to login */}
      </div>
    ); 
  }

  // --- Render Main Content --- 
  const welcomeMessage = user?.name ? `Welcome back, ${user.name}!` : 'Welcome to your Dashboard!';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{welcomeMessage}</h1>
        <Button onClick={logout} variant="outline">Logout</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader><CardTitle>Total Messages</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-gray-900 dark:text-white">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Response Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold text-gray-900 dark:text-white">0%</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-600 dark:text-gray-300">No recent activity</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Communications</CardTitle></CardHeader>
        <CardContent>
          {/* Show skeleton only while data is loading, *after* auth is confirmed */}
          {isLoadingData ? (
            <CommunicationsSkeleton />
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : recentCommunications.length > 0 ? (
            <ul className="space-y-2">
              {recentCommunications.map((comm) => (
                <li key={comm.id} className="text-sm text-gray-600 dark:text-gray-300">
                  {/* Display communication details, handle potential undefined date */}
                  {comm.channel?.toUpperCase()}: {comm.subject || 'No Subject'} - 
                  {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : 'Unknown date'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent communications found.</p>
          )
          }
        </CardContent>
      </Card>
    </div>
  );
}

// --- Original Page Component (Now simpler) ---
export default function DashboardPage() { 
  // This component is now extremely simple and doesn't call problematic hooks directly.
  console.log("Rendering DashboardPage (outer shell)");
  return <DashboardContent />;
}

// --- Skeleton Component --- 
// Updated skeleton to optionally hide data sections during initial auth load
function DashboardSkeleton({ showDataSections = true }: { showDataSections?: boolean }) {
  console.log(`Rendering DashboardSkeleton (showDataSections: ${showDataSections})`);
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
        </Card>
      </div>

      {/* Recent Communications Card Skeleton (conditionally rendered) */}
      {showDataSections && (
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent>
             <CommunicationsSkeleton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Specific skeleton for the communications list content
function CommunicationsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
