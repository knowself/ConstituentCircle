import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../lib/database/service';
import { Communication } from '../lib/types/communication';
import { Analytics } from '../lib/types/analytics';

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

const communicationService = new DatabaseService<Communication>('communications');
const analyticsService = new DatabaseService<Analytics>('analytics');

export function useDashboard({
  communicationLimit = 5,
  analyticsLimit = 7,
  analyticsType = 'communication',
  analyticsPeriod = 'daily',
}: UseDashboardOptions = {}): DashboardData {
  const { user } = useAuth();
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
        const communications = await communicationService.query({
          representative_id: user.id,
          _limit: communicationLimit,
          _sort: 'createdAt:desc'
        });

        // Load analytics if user has permission
        let analytics: Analytics[] = [];
        const userData = user.user_metadata;
        if (userData?.role === 'admin' || userData?.role === 'staff') {
          analytics = await analyticsService.query({
            type: analyticsType,
            period: analyticsPeriod,
            _limit: analyticsLimit,
            _sort: 'createdAt:desc'
          });
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
