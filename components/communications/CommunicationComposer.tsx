import { useState, useEffect } from 'react';
import { Communication } from '../../lib/firebase/firestore/types';
import { CommunicationType, CommunicationChannel, CommunicationDirection } from '../../lib/types/communication';
import { Timestamp } from 'firebase/firestore';

interface CommunicationComposerProps {
  initialData?: Partial<Communication>;
  onSave: (data: Partial<Communication>) => Promise<void>;
  onCancel: () => void;
}

export default function CommunicationComposer({
  initialData,
  onSave,
  onCancel,
}: CommunicationComposerProps) {
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [type, setType] = useState<CommunicationType>(
    initialData?.type || 'direct'
  );
  const [direction, setDirection] = useState<CommunicationDirection>(
    initialData?.direction || 'outbound'
  );
  const [channel, setChannel] = useState<CommunicationChannel>(
    initialData?.channel || 'email'
  );
  const [visibility, setVisibility] = useState(initialData?.visibility || 'private');
  const [scheduledFor, setScheduledFor] = useState<Date | null>(
    initialData?.scheduledFor ? initialData.scheduledFor.toDate() : null
  );
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelOptions: CommunicationChannel[] = [
    'email',
    'sms',
    'whatsapp',
    'facebook',
    'twitter',
    'other'
  ];

  const typeOptions: CommunicationType[] = [
    'broadcast',
    'direct',
    'group',
    'constituent-to-constituent'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        subject,
        content,
        type,
        direction,
        channel,
        visibility,
        scheduledFor: scheduledFor ? Timestamp.fromDate(scheduledFor) : undefined,
        metadata: {
          tags: socialPlatforms,
          platform: socialPlatforms.join(','),
          aiGenerated: false,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save communication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>
      )}

      {/* Communication Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CommunicationType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Channel Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Channel</label>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as CommunicationChannel)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {channelOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visibility
        </label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'group')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="group">Group</option>
        </select>
      </div>

      {/* Schedule */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Schedule (optional)
        </label>
        <input
          type="datetime-local"
          value={scheduledFor ? scheduledFor.toISOString().slice(0, 16) : ''}
          onChange={(e) => setScheduledFor(e.target.value ? new Date(e.target.value) : null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Social Platforms */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cross-post to Social Media
        </label>
        <div className="mt-2 space-y-2">
          {['facebook', 'twitter', 'whatsapp'].map((platform) => (
            <label key={platform} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={socialPlatforms.includes(platform)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSocialPlatforms([...socialPlatforms, platform]);
                  } else {
                    setSocialPlatforms(socialPlatforms.filter((p) => p !== platform));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter subject"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your message"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
