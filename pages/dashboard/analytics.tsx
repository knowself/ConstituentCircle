import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - replace with real data from your analytics service
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Email',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'SMS',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Social',
        data: [45, 25, 32, 67, 49, 54, 47],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  const channelBreakdown = {
    labels: ['Email', 'SMS', 'WhatsApp', 'Facebook', 'Twitter'],
    datasets: [
      {
        data: [300, 150, 100, 200, 250],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(53, 162, 235, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      },
    ],
  };

  const responseRates = {
    labels: ['Email', 'SMS', 'WhatsApp', 'Facebook', 'Twitter'],
    datasets: [
      {
        label: 'Response Rate (%)',
        data: [65, 75, 82, 45, 55],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const metrics = [
    { name: 'Total Communications', value: '1,234', change: '+12.3%' },
    { name: 'Engagement Rate', value: '68.7%', change: '+5.4%' },
    { name: 'Avg Response Time', value: '2.4h', change: '-15.2%' },
    { name: 'Active Constituents', value: '892', change: '+8.7%' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track engagement and performance across all channels
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 truncate">
                        {metric.name}
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">
                        {metric.value}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          metric.change.startsWith('+')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Engagement Over Time */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Engagement Over Time
              </h3>
              <Line
                data={engagementData}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            {/* Channel Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Channel Distribution
              </h3>
              <Doughnut
                data={channelBreakdown}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>

            {/* Response Rates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Response Rates by Channel
              </h3>
              <Bar
                data={responseRates}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Geographic Distribution
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Map visualization coming soon
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
