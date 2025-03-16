import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../lib/database/service';
import { Communication } from '../lib/types/communication';
import { Analytics } from '../lib/types/analytics';
import { CommunicationQuery } from '../types'; // Fixed import path

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
        const communications = (await communicationService.query<CommunicationQuery>({
          representative_id: user.id,
          _limit: communicationLimit,
          _sort: 'createdAt:desc'
        })).map(result => ({
          id: result.id || generateId(),
          subject: result.subject ?? '',
          content: result.content || '',
          type: (result.type as Communication['type']) || 'email',
          direction: (result.direction as Communication['direction']) || 'inbound',
          representative_id: result.representative_id || user?.id || '',
          channel: (result.channel as Communication['channel']) || 'email',
          visibility: (result.visibility as Communication['visibility']) || 'public',
          status: (result.status as Communication['status']) || 'active',
          createdAt: result.createdAt || new Date(),
          updatedAt: result.updatedAt || new Date(),
        }));

        // Load analytics if user has permission
        let analytics: Analytics[] = [];
        const userData = user?.user_metadata;
        if (userData?.role === 'admin' || userData?.role === 'staff') {
          const analytics = (await analyticsService.query({
            type: analyticsType,
            period: analyticsPeriod,
            _limit: analyticsLimit,
            _sort: 'createdAt:desc'
          })).map(result => ({
            id: generateId(), // Ensure id is present
            metrics: {},
            engagement: {},
            trends: {},
            timestamp: new Date(),
            type: result.type,
            period: result.period,
            _limit: result._limit,
            _sort: result._sort,
          }));
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
