import { useState, useEffect } from 'react';
import { ConstituentGroup } from '../../lib/firebase/firestore/types';

interface GroupComposerProps {
  initialData?: Partial<ConstituentGroup>;
  onSave: (data: Partial<ConstituentGroup>) => Promise<void>;
  onCancel: () => void;
}

export default function GroupComposer({
  initialData,
  onSave,
  onCancel,
}: GroupComposerProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<ConstituentGroup['type']>(
    initialData?.type || 'geographic'
  );
  const [tags, setTags] = useState<string[]>(initialData?.metadata?.tags || []);
  const [district, setDistrict] = useState(initialData?.metadata?.district || '');
  const [allowMemberPosts, setAllowMemberPosts] = useState(
    initialData?.settings?.allowMemberPosts ?? true
  );
  const [requireModeration, setRequireModeration] = useState(
    initialData?.settings?.requireModeration ?? true
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name,
        description,
        type,
        settings: {
          allowMemberPosts,
          requireModeration,
        },
        metadata: {
          tags,
          district,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save group');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>
      )}

      {/* Basic Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Group Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter group description"
        />
      </div>

      {/* Group Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ConstituentGroup['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="geographic">Geographic</option>
          <option value="demographic">Demographic</option>
          <option value="interest">Interest-based</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* District (for geographic groups) */}
      {type === 'geographic' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            District
          </label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter district number"
          />
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag"
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allowMemberPosts}
            onChange={(e) => setAllowMemberPosts(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Allow member posts
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={requireModeration}
            onChange={(e) => setRequireModeration(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Require post moderation
          </label>
        </div>
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
