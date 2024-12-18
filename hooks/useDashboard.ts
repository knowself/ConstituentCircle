import { useState, useEffect } from 'react';
import { useAuth } from '../lib/firebase/auth';
import {
  communicationService,
  analyticsService,
} from '../lib/firebase/firestore/service';
import { Communication, Analytics } from '../lib/firebase/firestore/types';
import { where, orderBy, limit, QueryConstraint } from 'firebase/firestore';

interface DashboardData {
  communications: Communication[];
  analytics: Analytics[];
  loading: boolean;
  error: string | null;
}

interface UseDashboardOptions {
  communicationLimit?: number;
  analyticsLimit?: number;
  analyticsType?: Analytics['type'];
  analyticsPeriod?: Analytics['period'];
}

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
        const communicationConstraints: QueryConstraint[] = [
          where('representativeId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(communicationLimit),
        ];

        const communications = await communicationService.query(
          communicationConstraints
        );

        // Load analytics if user has permission
        let analytics: Analytics[] = [];
        if (user.role === 'admin' || user.role === 'staff') {
          const analyticsConstraints: QueryConstraint[] = [
            where('type', '==', analyticsType),
            where('period', '==', analyticsPeriod),
            orderBy('createdAt', 'desc'),
            limit(analyticsLimit),
          ];

          analytics = await analyticsService.query(analyticsConstraints);
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
