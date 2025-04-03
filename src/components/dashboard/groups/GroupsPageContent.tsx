'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Use alias
import type { ConstituentGroup } from '@root/lib/types/groups'; // Use @root alias
import GroupComposer from '@/components/groups/GroupComposer'; // Use alias

export default function GroupsPageContent() {
  const { user } = useAuth();
  const [showComposer, setShowComposer] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ConstituentGroup | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - moved from page.tsx
  const [groups, setGroups] = useState<ConstituentGroup[]>([
    {
      id: '1',
      representativeId: mounted && user?._id ? user._id : '', // Conditional access based on mounted
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleCreateGroup = async (data: Partial<ConstituentGroup>) => {
    // Implement group creation logic (using mock data for now)
    console.log('Creating group:', data);
    const newGroup: ConstituentGroup = {
      id: String(Date.now()), // Simple unique ID for mock
      representativeId: user?._id || 'mockRepId',
      name: data.name || 'New Group',
      description: data.description || '',
      type: data.type || 'interest',
      members: [],
      moderators: [],
      settings: data.settings || { allowMemberPosts: true, requireModeration: false },
      metadata: data.metadata || { tags: [] },
      analytics: data.analytics || { totalMembers: 0, activeMembers: 0, postsCount: 0, engagementRate: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setGroups(prev => [...prev, newGroup]);
    setShowComposer(false);
  };

  const handleEditGroup = (group: ConstituentGroup) => {
    setSelectedGroup(group);
    setShowComposer(true);
  };
  
  // JSX moved from page.tsx
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Constituent Groups
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and organize your constituent communities
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedGroup(null);
            setShowComposer(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          New Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {group.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {group.description}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    group.type === 'geographic'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : group.type === 'demographic'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : group.type === 'interest'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {group.type}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Members</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {group.analytics?.totalMembers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Engagement
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {group.analytics?.engagementRate || 0}%
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex space-x-2">
                  {group.metadata?.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                onClick={() => handleEditGroup(group)}
                className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Manage group
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Group Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedGroup ? 'Edit Group' : 'New Group'}
              </h2>
            </div>
            <GroupComposer
              initialData={selectedGroup || undefined}
              onSave={handleCreateGroup} // Pass handleCreateGroup directly
              onCancel={() => setShowComposer(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
