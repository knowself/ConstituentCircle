import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

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
  const queryCommunications = useQuery(api.communications.getCommunications, {
    type: options.type,
    direction: options.direction,
    channel: options.channel,
    limit: options.limit,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCommunications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await api.communications.getCommunications({
        type: options.type,
        direction: options.direction,
        channel: options.channel,
        limit: options.limit,
      });

      setCommunications(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, options]);

  const createCommunication = async (data: Partial<Communication>) => {
    try {
      const result = await api.communications.createCommunication(data);
      return result;
    } catch (error) {
      console.error("Error creating communication:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleSocialEngagement = async (communicationId: string, engagement: SocialEngagement) => {
    if (!user) throw new Error('User not authenticated');

    const communication = await api.communications.getCommunication(communicationId);

    const updatedAnalytics = {
      ...communication.analytics,
      engagement: {
        likes: (communication.analytics?.engagement?.likes || 0) + (engagement.type === 'reaction' ? 1 : 0),
        shares: (communication.analytics?.engagement?.shares || 0) + (engagement.type === 'share' ? 1 : 0),
        comments: (communication.analytics?.engagement?.comments || 0) + (engagement.type === 'comment' ? 1 : 0),
        reach: (communication.analytics?.engagement?.reach || 0)
      }
    };

    await api.communications.updateCommunication(communicationId, { analytics: updatedAnalytics });
  };

  return {
    communications: queryCommunications,
    loading,
    error,
    createCommunication,
    handleSocialEngagement,
    refresh: fetchCommunications,
  };
};
