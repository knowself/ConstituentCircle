"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Communication } from "@root/lib/types/communication";

export default function DashboardPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const communications = useQuery(api.communications.getByRepresentative, {
    representativeId: user?._id ?? "skip",
  });

  const recentCommunications = useMemo<Communication[]>(() => {
    if (!communications) return [];
    return communications.slice(0, 5).map((item) => ({
      id: String(item._id),
      subject: item.subject ?? "",
      content: item.message,
      type: "direct",
      direction: "outbound",
      channel: "email",
      visibility: "public",
      status: (item.status as Communication["status"]) ?? "pending",
      createdAt: new Date(item.createdAt ?? item._creationTime ?? Date.now()),
      updatedAt: new Date(item.updatedAt ?? item._creationTime ?? Date.now()),
    }));
  }, [communications]);

  if (authLoading || communications === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Welcome, {user?.name || "User"}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is your dashboard where you can manage all your constituent communications and analyze engagement data.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Communications</h3>
        {recentCommunications.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentCommunications.map((communication) => (
                <li key={communication.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {communication.subject || "Untitled"}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {communication.content}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {communication.createdAt?.toLocaleDateString() ?? "Unknown date"} • {communication.channel} • {communication.status}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          communication.status === "sent"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
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
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {recentCommunications.length}
                </dd>
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
