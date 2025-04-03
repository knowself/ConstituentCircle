import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useAuth } from '@/context/AuthContext';

const INITIAL_NUM_ITEMS = 10;

export const useCommunications = (representativeId: Id<"users"> | null) => {
  const { user } = useAuth();

  const {
    results: communications,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.communications.getByRepresentative,
    representativeId ? { representativeId } : "skip",
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  const createCommunication = async (data: {
    constituentId: Id<"users">;
    subject: string;
    message: string;
  }) => {
    if (!user?._id) throw new Error('User not authenticated');
    
    try {
      const result = await api.communications.createCommunication({
        representativeId: user._id,
        ...data
      });
      return result;
    } catch (error) {
      console.error("Error creating communication:", error);
      throw error;
    }
  };

  const handleSocialEngagement = async (
    communicationId: Id<"communications">, 
    engagement: {
      type: 'reaction' | 'share' | 'comment';
    }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const communication = await api.communications.getCommunication({
        communicationId
      });

      const updatedAnalytics = {
        engagement: {
          likes: (communication?.analytics?.engagement?.likes || 0) + (engagement.type === 'reaction' ? 1 : 0),
          shares: (communication?.analytics?.engagement?.shares || 0) + (engagement.type === 'share' ? 1 : 0),
          comments: (communication?.analytics?.engagement?.comments || 0) + (engagement.type === 'comment' ? 1 : 0),
          reach: communication?.analytics?.engagement?.reach || 0
        }
      };

      await api.communications.updateCommunication({
        communicationId,
        updates: { analytics: updatedAnalytics }
      });
    } catch (error) {
      console.error("Error handling social engagement:", error);
      throw error;
    }
  };

  return {
    communications: communications ?? [],
    status,
    loadMore,
    createCommunication,
    handleSocialEngagement,
  };
};
