'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useCommunications } from '../../../../hooks/useCommunications';
import { CommunicationType, CommunicationChannel, CommunicationDirection } from '../../../../lib/types/communication';
import { Communication } from '../../../../lib/types/communication';
import CommunicationComposer from '../../../../components/communications/CommunicationComposer';

export default function CommunicationsPage() {
  const [showComposer, setShowComposer] = useState(false);
  const [selectedType, setSelectedType] = useState<CommunicationType>();
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    communications,
    loading,
    error,
    createCommunication,
    handleSocialEngagement,
  } = useCommunications({
    type: selectedType,
    channel: selectedChannel,
  });

  const handleCreateCommunication = async (data: Partial<Communication>) => {
    try {
      await createCommunication(data);
      setShowComposer(false);
    } catch (err) {
      console.error('Failed to create communication:', err);
    }
  };

  const handleEngagement = async (communicationId: string, type: 'reaction' | 'share' | 'comment' | 'post') => {
    try {
      await handleSocialEngagement(communicationId, {
        type,
        platform: 'facebook',
        analytics: {
          likes: type === 'reaction' ? 1 : 0,
          shares: type === 'share' ? 1 : 0,
          comments: type === 'comment' ? 1 : 0,
          reach: 0
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'web'
        }
      });
    } catch (err) {
      console.error('Failed to handle engagement:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your constituent communications across all channels
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          New Communication
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value as CommunicationType || undefined)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="broadcast">Broadcast</option>
              <option value="direct">Direct</option>
              <option value="group">Group</option>
              <option value="constituent-to-constituent">Peer</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Channel
            </label>
            <select
              value={selectedChannel || ''}
              onChange={(e) => setSelectedChannel(e.target.value as CommunicationChannel || undefined)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Channels</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">{error.message}</div>
        ) : communications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No communications found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {communications.map((comm: Communication) => (
              <li key={comm.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0">
                        {comm.channel === 'email' && (
                          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        )}
                        {comm.channel === 'sms' && (
                          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" />
                          </svg>
                        )}
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {comm.subject}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{comm.createdAt instanceof Date ? comm.createdAt.toLocaleDateString() : comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : 'No date'}</span>
                        <span>•</span>
                        <span className="capitalize">{comm.type}</span>
                        <span>•</span>
                        <span>{comm.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {comm.analytics?.engagement && (
                          <>
                            <button
                              onClick={() => comm.id && handleEngagement(comm.id, 'reaction')}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                            >
                              <span className="text-sm">{comm.analytics?.engagement?.likes || 0}</span>
                              <span className="sr-only">likes</span>
                            </button>
                            <button
                              onClick={() => comm.id && handleEngagement(comm.id, 'share')}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                            >
                              <span className="text-sm">{comm.analytics?.engagement?.shares || 0}</span>
                              <span className="sr-only">shares</span>
                            </button>
                            <button
                              onClick={() => comm.id && handleEngagement(comm.id, 'comment')}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                            >
                              <span className="text-sm">{comm.analytics?.engagement?.comments || 0}</span>
                              <span className="sr-only">comments</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
