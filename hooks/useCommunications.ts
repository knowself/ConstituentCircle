import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Remove or comment out Supabase imports
// import { supabase } from '../lib/supabase';

// Update any functions that use Supabase
// For example, if there's a function like:
// const fetchCommunications = async () => {
//   const { data, error } = await supabase.from('communications').select('*');
//   // ...
// }

// Replace with appropriate Convex queries or other data source
import {
  Communication,
  CommunicationType,
  CommunicationDirection,
  CommunicationChannel,
  SocialEngagement
} from '../lib/types/communication';

interface UseCommunicationsOptions {
  type?: CommunicationType;
  direction?: CommunicationDirection;
  channel?: CommunicationChannel;
  limit?: number;
}

export const useCommunications = (options: UseCommunicationsOptions = {}) => {
  const { user } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCommunications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('communications')
        .select('*');

      // Apply filters based on user role and access permissions
      if (user.user_metadata?.role === 'admin') {
        // No additional filters for admin
      } else if (user.user_metadata?.role === 'staff') {
        query = query.eq('representative_id', user.id);
      } else {
        query = query
          .eq('visibility', 'public')
          .eq('recipient_id', user.id);
      }

      // Apply option filters
      if (options.type) {
        query = query.eq('type', options.type);
      }
      if (options.direction) {
        query = query.eq('direction', options.direction);
      }
      if (options.channel) {
        query = query.eq('channel', options.channel);
      }

      // Apply sorting and limit
      query = query
        .order('createdAt', { ascending: false })
        .limit(options.limit || 50);

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setCommunications(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, options]);

  const createCommunication = async (data: Partial<Communication>) => {
    if (!user) throw new Error('User not authenticated');

    const newCommunication = {
      ...data,
      sender_id: user.id,
      sender_role: user.user_metadata?.role,
      representative_id: user.user_metadata?.role === 'admin' ? user.id : user.user_metadata?.representative_id,
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      metadata: {
        ...data.metadata,
        version: 1,
        tags: data.metadata?.tags || [],
      },
      analytics: {
        delivered: 0,
        opened: 0,
        clicked: 0,
        responded: 0,
      }
    };

    const { data: result, error } = await supabase
      .from('communications')
      .insert(newCommunication)
      .select()
      .single();

    if (error) throw error;
    return result;
  };

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleSocialEngagement = async (communicationId: string, engagement: SocialEngagement) => {
    if (!user) throw new Error('User not authenticated');

    const { data: communication, error: fetchError } = await supabase
      .from('communications')
      .select('analytics')
      .eq('id', communicationId)
      .single();

    if (fetchError) throw fetchError;

    const updatedAnalytics = {
      ...communication.analytics,
      engagement: {
        likes: (communication.analytics?.engagement?.likes || 0) + (engagement.type === 'reaction' ? 1 : 0),
        shares: (communication.analytics?.engagement?.shares || 0) + (engagement.type === 'share' ? 1 : 0),
        comments: (communication.analytics?.engagement?.comments || 0) + (engagement.type === 'comment' ? 1 : 0),
        reach: (communication.analytics?.engagement?.reach || 0)
      }
    };

    const { error: updateError } = await supabase
      .from('communications')
      .update({ analytics: updatedAnalytics })
      .eq('id', communicationId);

    if (updateError) throw updateError;
  };

  return {
    communications,
    loading,
    error,
    createCommunication,
    handleSocialEngagement,
    refresh: fetchCommunications,
  };
};
