import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../lib/database/service';
import { Communication } from '../../lib/types/communication';
import { Analytics } from '../../lib/types/analytics';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentCommunications, setRecentCommunications] = useState<Communication[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize services only when needed to avoid issues during server-side rendering
  const [communicationService, setCommunicationService] = useState<DatabaseService<Communication> | null>(null);
  const [analyticsService, setAnalyticsService] = useState<DatabaseService<Analytics> | null>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize services only on the client side
    setCommunicationService(new DatabaseService<Communication>('communications'));
    setAnalyticsService(new DatabaseService<Analytics>('analytics'));
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user || !mounted || !communicationService || !analyticsService) return;

      try {
        console.log('Loading dashboard data for user:', user.id);
        
        // Load recent communications
        const communications = await communicationService.query({
          representative_id: user.id,
          order: { created_at: 'desc' },
          limit: 5
        });
        setRecentCommunications(communications);

        // Load analytics
        const userRole = user.user_metadata?.role;
        console.log('User role:', userRole);
        
        if (userRole === 'admin' || userRole === 'staff') {
          const analyticsData = await analyticsService.query({
            type: 'communication',
            period: 'daily',
            order: { created_at: 'desc' },
            limit: 7
          });
          setAnalytics(analyticsData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    }

    if (user && mounted && communicationService && analyticsService) {
      loadDashboardData();
    }
  }, [user, mounted, communicationService, analyticsService]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {mounted && user?.user_metadata?.full_name ? user.user_metadata.full_name : 'User'}
            </h1>
            <p className="mt-1 text-gray-500">
              Here's what's happening with your communications
            </p>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Stats overview */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.length > 0 && analytics[0]?.metrics ? (
                  Object.entries(analytics[0].metrics).slice(0, 4).map(([key, value], index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow px-5 py-6"
                    >
                      <div className="text-sm font-medium text-gray-500 truncate">
                        {key}
                      </div>
                      <div className="mt-1 text-3xl font-semibold text-gray-900">
                        {value}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 bg-white rounded-lg shadow px-5 py-6">
                    <p className="text-gray-500">No analytics data available</p>
                  </div>
                )}
              </div>

              {/* Recent communications */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Recent Communications
                  </h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {recentCommunications.map((comm) => (
                    <li key={comm.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {comm.subject}
                          </p>
                          <p className="text-sm text-gray-500">
                            {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : 'No date'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              comm.status === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : comm.status === 'draft'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {comm.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
