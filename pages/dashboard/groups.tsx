import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { ConstituentGroup } from '../../lib/firebase/firestore/types';
import { Timestamp } from 'firebase/firestore';
import GroupComposer from '../../components/groups/GroupComposer';

export default function Groups() {
  const { user } = useAuth();
  const [showComposer, setShowComposer] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ConstituentGroup | null>(null);
  const [groups, setGroups] = useState<ConstituentGroup[]>([
    // Sample data - replace with real data from your Firestore service
    {
      id: '1',
      representativeId: user?.uid || '',
      name: 'District 5 Residents',
      description: 'Residents of District 5',
      type: 'geographic',
      members: [],
      moderators: [],
      settings: {
        allowMemberPosts: true,
        requireModeration: true,
      },
      metadata: {
        tags: ['district-5', 'residents'],
        district: '5',
      },
      analytics: {
        totalMembers: 150,
        activeMembers: 120,
        postsCount: 45,
        engagementRate: 72,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    // Add more sample groups
  ]);

  const handleCreateGroup = async (data: Partial<ConstituentGroup>) => {
    // Implement group creation logic
    console.log('Creating group:', data);
    setShowComposer(false);
  };

  const handleEditGroup = (group: ConstituentGroup) => {
    setSelectedGroup(group);
    setShowComposer(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Constituent Groups
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and organize your constituent communities
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedGroup(null);
                setShowComposer(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              New Group
            </button>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {group.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {group.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        group.type === 'geographic'
                          ? 'bg-green-100 text-green-800'
                          : group.type === 'demographic'
                          ? 'bg-blue-100 text-blue-800'
                          : group.type === 'interest'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {group.type}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Members</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {group.analytics.totalMembers}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Engagement
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {group.analytics.engagementRate}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex space-x-2">
                      {group.metadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 text-right">
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="text-sm text-blue-600 hover:text-blue-900"
                  >
                    Manage group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Composer Modal */}
        {showComposer && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedGroup ? 'Edit Group' : 'New Group'}
                </h2>
              </div>
              <GroupComposer
                initialData={selectedGroup || undefined}
                onSave={handleCreateGroup}
                onCancel={() => setShowComposer(false)}
              />
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
