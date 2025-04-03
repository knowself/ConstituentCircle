import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DatabaseService } from '@root/lib/database/service';
import {
  Communication,
  CommunicationType,
  CommunicationDirection,
  CommunicationChannel,
} from '@root/lib/types/communication';
import { Analytics } from '@root/lib/types/analytics';
import { CommunicationQuery } from '../../types';
import { Id } from '@convex/_generated/dataModel';

interface ConvexCommunicationResult {
  _id: Id<"communications">;
  _creationTime: number;
  createdAt: number;
  representativeId: Id<"users">; 
  constituentId: Id<"constituents">; 
  messageType: string;
  content: string;
  channel: string;
  status: string;
  sentAt?: number; 
}

// Define the structure returned by the Convex analytics query (use any for now)
type ConvexAnalyticsResult = any;

// Helper function to map Convex communication results to our Communication type
const mapConvexToCommunication = (result: ConvexCommunicationResult): Communication => ({
  id: String(result._id), // Convert Convex Id to string
  subject: result.messageType || "", // Use messageType as subject, default to empty
  content: result.content,
  type: (result.messageType as CommunicationType) || "direct", // Cast to CommunicationType, default
  direction: "outbound" as CommunicationDirection, // Default assumption, adjust if needed
  channel: (result.channel as CommunicationChannel) || "email", // Cast to CommunicationChannel, default
  visibility: ("public" as 'public' | 'private' | 'group'), // Default assumption, cast
  status: (result.status as 'draft' | 'sent' | 'delivered' | 'read') || "sent", // Cast to literal type, default
  createdAt: new Date(result.createdAt), // Convert number timestamp to Date
  updatedAt: new Date(result._creationTime), // Use _creationTime for updatedAt
});

// Helper function to map Convex analytics results to our Analytics type
const mapConvexToAnalytics = (result: ConvexAnalyticsResult): Analytics => ({
  id: String(result._id), // Assuming _id exists
  period: result.period || 'daily', // Default if period is missing
  metrics: {
    totalCommunications: 0,
    engagementRate: 0,
    responseRate: 0,
    averageResponseTime: 0,
  },
  engagement: {
    likes: 0,
    shares: 0,
    comments: 0,
    reach: 0,
  },
  trends: {
    topTopics: [],
    sentimentScores: {},
    peakEngagementTimes: [],
  },
  timestamp: (result.timestamp ? new Date(result.timestamp) : new Date()).toISOString(), // Convert to Date then to ISO string
});

interface DashboardData {
  communications: Communication[];
  analytics: Analytics[];
  loading: boolean;
  error: string | null;
}

interface UseDashboardOptions {
  communicationLimit?: number;
  analyticsLimit?: number;
  analyticsType?: 'communication' | 'engagement' | 'demographics';
  analyticsPeriod?: Analytics['period'];
}

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  user_metadata: { role: string };
}

const communicationService = new DatabaseService<Communication>('communications');
const analyticsService = new DatabaseService<Analytics>('analytics');

function generateId() {
  // Implement your id generation logic here
  // For demonstration purposes, a simple random id is generated
  return Math.random().toString(36).substr(2, 9);
}

export function useDashboard({
  communicationLimit = 5,
  analyticsLimit = 7,
  analyticsType = 'communication',
  analyticsPeriod = 'daily',
}: UseDashboardOptions = {}): DashboardData {
  const { user } = useAuth() as { user: UserProfile | null };
  const [data, setData] = useState<DashboardData>({
    communications: [],
    analytics: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        // Load communications
        const communications: Communication[] = await communicationService.query<
          CommunicationQuery,
          Communication,
          ConvexCommunicationResult
        >(
          {
            representative_id: user.id,
            _limit: communicationLimit,
            _sort: 'createdAt:desc'
          },
          mapConvexToCommunication
        );

        // Load analytics if user has permission
        let analytics: Analytics[] = [];
        const userData = user?.user_metadata;
        if (userData?.role === 'admin' || userData?.role === 'staff') {
          type AnalyticsQuery = { type: string; period: string; _limit: number; _sort: string };
          analytics = await analyticsService.query<
            AnalyticsQuery,
            Analytics,
            ConvexAnalyticsResult
          >(
            {
              type: analyticsType,
              period: analyticsPeriod,
              _limit: analyticsLimit,
              _sort: 'createdAt:desc'
            },
            mapConvexToAnalytics
          );
        }

        setData({
          communications,
          analytics,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again later.',
        }));
      }
    }

    loadDashboardData();
  }, [user, communicationLimit, analyticsLimit, analyticsType, analyticsPeriod]);

  return data;
}
