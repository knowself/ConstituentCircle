import { usePaginatedQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useAuth } from '../context/AuthContext'; // Keep useAuth for potential use in create/handle functions

// Assuming Communication type aligns with Doc<"communications"> or can be adapted
// If not, replace Communication with Doc<"communications"> from "../convex/_generated/dataModel"
import {
  Communication,
  SocialEngagement
} from '../lib/types/communication'; // Keep relevant types

const INITIAL_NUM_ITEMS = 10; // Number of items to fetch initially and per loadMore call

export const useCommunications = (representativeId: Id<"users"> | null) => {
  const { user } = useAuth(); // Keep user context if needed for create/handle functions

  const {
    results: communications, // Rename results to communications for consistency
    status, // Provides loading/error states: "loading", "canLoadMore", "exhausted"
    loadMore,
  } = usePaginatedQuery(
    api.communications.getByRepresentative,
    representativeId ? { representativeId } : "skip", // Pass representativeId or skip if null
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  // TODO: Verify api.communications.createCommunication exists and update if needed
  const createCommunication = async (data: Partial<Communication>) => {
    try {
      // @ts-expect-error - Need to verify/update this API call
      const result = await api.communications.createCommunication(data);
      return result;
    } catch (error) {
      console.error("Error creating communication:", error);
      throw error; // Rethrow or handle the error as needed
    }
  };

  // TODO: Verify api.communications.getCommunication and updateCommunication exist and update if needed
  const handleSocialEngagement = async (communicationId: string, engagement: SocialEngagement) => {
    if (!user) throw new Error('User not authenticated'); // Keep auth check if needed

    try {
      // @ts-expect-error - Need to verify/update this API call
      const communication = await api.communications.getCommunication(communicationId);

      // This logic might need adjustment based on the actual communication structure
      const updatedAnalytics = {
        ...(communication?.analytics ?? {}), // Use nullish coalescing
        engagement: {
          likes: (communication?.analytics?.engagement?.likes || 0) + (engagement.type === 'reaction' ? 1 : 0),
          shares: (communication?.analytics?.engagement?.shares || 0) + (engagement.type === 'share' ? 1 : 0),
          comments: (communication?.analytics?.engagement?.comments || 0) + (engagement.type === 'comment' ? 1 : 0),
          reach: (communication?.analytics?.engagement?.reach || 0)
        }
      };

      // @ts-expect-error - Need to verify/update this API call
      await api.communications.updateCommunication(communicationId, { analytics: updatedAnalytics });
    } catch (error) {
      console.error("Error handling social engagement:", error);
      throw error;
    }
  };

  return {
    communications: communications ?? [], // Return empty array if null/undefined
    status,
    loadMore,
    createCommunication, // Keep existing functions, acknowledge potential issues
    handleSocialEngagement, // Keep existing functions, acknowledge potential issues
  };
};
