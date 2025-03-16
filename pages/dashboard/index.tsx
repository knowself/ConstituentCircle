import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../lib/database/service';
import { Communication, CommunicationType, CommunicationDirection, CommunicationChannel } from '../../lib/types/communication';
import React, { useState, useEffect } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Define the ConvexCommunication interface based on what Convex returns
interface ConvexCommunication {
  _id: Id<"communications">;
  _creationTime: number;
  createdAt: number;
  representativeId: Id<"representatives">;
  constituentId: Id<"constituents">;
  messageType: string;
  content: string;
  channel: string;
  status: string;
  sentAt: number;
}

/**
 * Dashboard component that displays user information and recent communications.
 * Uses React.createElement to avoid JSX type issues.
 * Uses dynamic import with ssr: false to prevent server-side rendering issues with Convex.
 */
// Create a loading component that will be shown during client-side rendering
const LoadingComponent = () => {
  return React.createElement(
    'div', { className: "container mx-auto px-4 py-8 flex justify-center items-center h-screen" },
    React.createElement('p', null, "Loading dashboard...")
  );
};

// The actual dashboard component that will only be rendered on the client
const DashboardComponent = () => {
  const { user } = useAuth();
  const [recentCommunications, setRecentCommunications] = useState<Communication[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If we're in a server environment, don't do anything
    if (typeof window === 'undefined') return;

    async function loadData() {
      if (user) {
        console.log('Loading dashboard data for user:', user.id);

        // Load recent communications
        const communicationService = new DatabaseService('communications');
        try {
          // First, get the raw results
          const rawResults = await communicationService.query({
            representativeId: user.id,
            _limit: 5
          });

          console.log("Results from getRecentCommunications:", rawResults);
          
          // Then cast them to the correct type
          const results = rawResults as unknown as ConvexCommunication[];

          // Map the Convex data structure to the expected Communication interface
          const communications = results.map(result => ({
            id: String(result._id),
            subject: result.messageType || "", // Use messageType as subject
            content: result.content || "",
            type: (result.messageType as CommunicationType) || "direct",
            direction: "outbound" as CommunicationDirection, // Default to outbound
            channel: (result.channel as CommunicationChannel) || "email",
            visibility: "public" as "public" | "private" | "group", // Default to public
            status: (result.status as "draft" | "sent" | "delivered" | "read") || "sent",
            createdAt: new Date(result.createdAt),
            updatedAt: new Date(result._creationTime)
          }));
          
          setRecentCommunications(communications);
        } catch (error) {
          console.error("Error fetching communications:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // If no user, redirect to login
        router.push('/auth/signin');
      }
    }

    loadData();
  }, [user, router])

  // If still loading, show loading indicator
  if (isLoading) {
    return React.createElement(
      'div', { className: "container mx-auto px-4 py-8 flex justify-center items-center" },
      React.createElement('p', null, "Loading dashboard data...")
    );
  }

  // Create the dashboard content using React.createElement
  const dashboardContent = React.createElement(
    'div', { className: "container mx-auto px-4 py-8" },
    React.createElement('h1', { className: "text-2xl font-bold mb-4" }, "Dashboard"),
    React.createElement('p', null, `Welcome, ${user?.displayName || 'User'}!`),
    React.createElement('div', { className: "mb-4" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Recent Communications"),
      recentCommunications.length > 0 ?
        React.createElement('ul', null,
          recentCommunications.map(communication =>
            React.createElement('li', { key: communication.id, className: "border p-2 mb-2 rounded" },
              React.createElement('strong', { className: "font-semibold" }, communication.subject),
              React.createElement('p', null, communication.content)
            )
          )
        ) :
        React.createElement('p', null, "No recent communications found.")
    )
  );

  return dashboardContent;
};

// Use dynamic import with ssr: false to prevent server-side rendering
// This ensures the component is only loaded on the client side
const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
  loading: () => React.createElement(LoadingComponent, null)
});

// Create a simple server-side safe page component
function DashboardPage() {
  return React.createElement(Dashboard, null);
}

export default DashboardPage;
