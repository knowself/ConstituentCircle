'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../lib/database/service';
import { Communication, CommunicationType, CommunicationDirection, CommunicationChannel } from '../../../lib/types/communication';
import { Id } from '../../../convex/_generated/dataModel';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentCommunications, setRecentCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      }
    }

    loadData();
  }, [user]);

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Welcome, {user?.displayName || 'User'}!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is your dashboard where you can manage all your constituent communications and analyze engagement data.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Communications</h3>
        {recentCommunications.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentCommunications.map(communication => (
                <li key={communication.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{communication.subject}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{communication.content}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {communication.createdAt.toLocaleDateString()} • {communication.channel} • {communication.status}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${communication.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                        {communication.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">No recent communications found.</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create New Message
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Stats</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Messages</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">0</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Rate</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">0%</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Tasks</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-300">No upcoming tasks</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-300">No recent activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
