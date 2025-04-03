import { useState } from 'react';
import { Id } from '../../../convex/_generated/dataModel';

interface CreateCommunicationData {
  constituentId: Id<"users">;
  subject: string;
  message: string;
}

interface CommunicationComposerProps {
  onSave: (data: CreateCommunicationData) => Promise<void>;
  onCancel: () => void;
}

export default function CommunicationComposer({
  onSave,
  onCancel,
}: CommunicationComposerProps) {
  const [constituentId, setConstituentId] = useState<Id<"users">>('' as Id<"users">);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!constituentId || !subject.trim() || !message.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        constituentId,
        subject,
        message
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

      {/* Constituent ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Constituent ID
        </label>
        <input
          type="text"
          value={constituentId}
          onChange={(e) => setConstituentId(e.target.value as Id<"users">)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter constituent ID"
        />
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

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
