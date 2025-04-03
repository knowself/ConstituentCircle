'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCommunications } from '@/hooks/useCommunications'; 
import CommunicationComposer from '@/components/communications/CommunicationComposer';
import { Doc, Id } from '@convex/_generated/dataModel'; 

export default function CommunicationsPageContent() {
  const [showComposer, setShowComposer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Properly type the user ID parameter
  const {
    communications,
    status,
    loadMore,
    createCommunication,
    handleSocialEngagement,
  } = useCommunications(user?._id as Id<"users"> | null);

  interface CreateCommunicationData {
    constituentId: Id<"users">;
    subject: string;
    message: string;
  }

  const handleCreateCommunication = async (data: CreateCommunicationData) => {
    try {
      await createCommunication({
        constituentId: data.constituentId,
        subject: data.subject,
        message: data.message
      });
      setShowComposer(false);
    } catch (err) {
      console.error('Failed to create communication:', err);
    }
  };

  const handleEngagement = async (communicationId: Id<"communications">) => {
    try {
      if (!communicationId) {
        console.error("Invalid communication ID");
        return;
      }
      await handleSocialEngagement(communicationId, {
        type: 'reaction'
      });
    } catch (err) {
      console.error('Failed to handle engagement:', err);
    }
  };

  const isLoading = authLoading || status === 'LoadingFirstPage' || status === 'LoadingMore';

  if (!mounted) {
    // Render loading state or null while waiting for the client-side mount
    // This prevents calling useAuth during SSR/prerendering
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>; 
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your constituent communications
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
        >
          New Communication
        </button>
      </div>

      {/* Communications List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading communications...</div>
        ) : status === 'Exhausted' && communications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No communications found.
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {communications.map((comm: Doc<"communications">) => (
                <li key={comm._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {comm.subject || 'No Subject'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{new Date(comm._creationTime).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{comm.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {status === 'CanLoadMore' && (
              <div className="p-4 text-center">
                <button
                  onClick={() => loadMore(10)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Communication Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      New Communication
                    </h3>
                    <div className="mt-4">
                      <CommunicationComposer
                        onSave={handleCreateCommunication}
                        onCancel={() => setShowComposer(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
