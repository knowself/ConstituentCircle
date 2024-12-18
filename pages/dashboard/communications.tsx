import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useCommunications } from '../../hooks/useCommunications';
import { CommunicationType, CommunicationChannel, Communication } from '../../lib/firebase/firestore/types';
import CommunicationComposer from '../../components/communications/CommunicationComposer';

export default function Communications() {
  const [showComposer, setShowComposer] = useState(false);
  const [selectedType, setSelectedType] = useState<CommunicationType>();
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>();
  
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

  const handleEngagement = async (communicationId: string, type: string) => {
    try {
      await handleSocialEngagement(communicationId, {
        type: type as 'post' | 'share' | 'comment' | 'reaction',
        platform: 'facebook', // Default platform, should be dynamic
        analytics: {
          likes: type === 'reaction' ? 1 : 0,
          shares: type === 'share' ? 1 : 0,
          comments: type === 'comment' ? 1 : 0,
          reach: 0,
        },
      });
    } catch (err) {
      console.error('Failed to handle engagement:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your constituent communications across all channels
              </p>
            </div>
            <button
              onClick={() => setShowComposer(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              New Communication
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value as CommunicationType || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">
                  Channel
                </label>
                <select
                  value={selectedChannel || ''}
                  onChange={(e) => setSelectedChannel(e.target.value as CommunicationChannel || undefined)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error.message}</div>
            ) : communications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No communications found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {communications.map((comm) => (
                  <li key={comm.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className="flex-shrink-0">
                            {comm.channel === 'email' && (
                              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            )}
                            {comm.channel === 'sms' && (
                              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" />
                              </svg>
                            )}
                          </span>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {comm.subject}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>{new Date(comm.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize">{comm.type}</span>
                            <span>•</span>
                            <span>{comm.status}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {comm.analytics?.engagement && (
                              <>
                                <button
                                  onClick={() => handleEngagement(comm.id, 'reaction')}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <span className="text-sm">{comm.analytics.engagement.likes}</span>
                                  <span className="sr-only">likes</span>
                                </button>
                                <button
                                  onClick={() => handleEngagement(comm.id, 'share')}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <span className="text-sm">{comm.analytics.engagement.shares}</span>
                                  <span className="sr-only">shares</span>
                                </button>
                                <button
                                  onClick={() => handleEngagement(comm.id, 'comment')}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <span className="text-sm">{comm.analytics.engagement.comments}</span>
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
        </div>

        {/* Communication Composer Modal */}
        {showComposer && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  New Communication
                </h2>
              </div>
              <CommunicationComposer
                onSave={handleCreateCommunication}
                onCancel={() => setShowComposer(false)}
              />
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
