'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { 
  ServerIcon, 
  CpuChipIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Define types for system metrics
interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  history?: number[];
}

// Define types for system alerts
interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

export default function SystemHealthPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    // If we're in a server environment, don't do anything
    if (typeof window === 'undefined') return;

    async function loadData() {
      if (user) {
        console.log('Loading system health data');
        setIsLoading(true);
        
        try {
          // In a real implementation, this would be an actual API call
          // For now, we'll simulate some data
          
          // Simulate fetching system metrics with a delay
          setTimeout(() => {
            setMetrics([
              { id: 'cpu', name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable', history: [42, 44, 47, 45, 43, 46, 45] },
              { id: 'memory', name: 'Memory Usage', value: 68, unit: '%', status: 'warning', trend: 'up', history: [60, 62, 65, 66, 67, 68, 68] },
              { id: 'disk', name: 'Disk Usage', value: 72, unit: '%', status: 'warning', trend: 'up', history: [65, 67, 68, 70, 71, 72, 72] },
              { id: 'network', name: 'Network Traffic', value: 32, unit: 'MB/s', status: 'healthy', trend: 'down', history: [40, 38, 36, 35, 33, 32, 32] },
              { id: 'api_latency', name: 'API Latency', value: 120, unit: 'ms', status: 'healthy', trend: 'stable', history: [118, 122, 125, 119, 121, 120, 120] },
              { id: 'db_queries', name: 'Database Queries', value: 250, unit: 'qps', status: 'healthy', trend: 'stable', history: [245, 248, 252, 249, 251, 250, 250] },
              { id: 'active_users', name: 'Active Users', value: 156, unit: 'users', status: 'healthy', trend: 'up', history: [120, 130, 142, 148, 152, 155, 156] },
              { id: 'error_rate', name: 'Error Rate', value: 1.2, unit: '%', status: 'healthy', trend: 'down', history: [2.1, 1.8, 1.6, 1.5, 1.4, 1.3, 1.2] },
            ]);
            
            setAlerts([
              { id: '1', title: 'Database Performance', description: 'Query performance degradation detected', severity: 'medium', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), resolved: false },
              { id: '2', title: 'API Rate Limit', description: 'Approaching maximum rate limit', severity: 'low', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), resolved: false },
              { id: '3', title: 'Storage Capacity', description: 'Storage usage at 85%', severity: 'high', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), resolved: false },
              { id: '4', title: 'Memory Leak', description: 'Potential memory leak in authentication service', severity: 'high', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), resolved: true },
              { id: '5', title: 'Network Latency', description: 'Increased latency in US-West region', severity: 'medium', timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), resolved: true },
            ]);
            
            setLastUpdated(new Date());
            setIsLoading(false);
          }, 1000); // Simulate network delay
          
        } catch (error) {
          console.error("Error fetching system health data:", error);
          setIsLoading(false);
        }
      }
    }

    loadData();
  }, [user]);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate refreshing data
    setTimeout(() => {
      // Update some random metrics to simulate changes
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5),
        history: [...(metric.history || []).slice(1), metric.value]
      })));
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <p>Loading system health data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">System Health</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor system performance and health metrics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={refreshData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* System Status Overview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Server Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                  <ServerIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Server Status</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">All systems operational</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">98% uptime in the last 30 days</p>
              </div>
            </div>
            
            {/* CPU Usage */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                  <CpuChipIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">CPU Usage</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.find(m => m.id === 'cpu')?.value}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${metrics.find(m => m.id === 'cpu')?.value}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Normal load</p>
              </div>
            </div>
            
            {/* Memory Usage */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Memory Usage</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.find(m => m.id === 'memory')?.value}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${metrics.find(m => m.id === 'memory')?.value}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Approaching warning threshold</p>
              </div>
            </div>
            
            {/* Disk Usage */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-orange-500">
                  <CircleStackIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Disk Usage</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.find(m => m.id === 'disk')?.value}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${metrics.find(m => m.id === 'disk')?.value}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Consider cleanup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Performance Metrics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {metrics.slice(0, 4).map((metric) => (
                <div key={metric.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{metric.name}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        metric.status === 'healthy' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {metric.value} {metric.unit}
                      </span>
                      {metric.trend && (
                        <span className="ml-2">
                          {metric.trend === 'up' && <span className="text-red-500">↑</span>}
                          {metric.trend === 'down' && <span className="text-green-500">↓</span>}
                          {metric.trend === 'stable' && <span className="text-gray-500">→</span>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-32 h-12 flex items-end">
                    {metric.history && (
                      <div className="w-full flex items-end space-x-1">
                        {metric.history.map((value, i) => {
                          const normalizedValue = (value / Math.max(...metric.history!)) * 100;
                          return (
                            <div 
                              key={i} 
                              className={`w-3 rounded-t-sm ${
                                metric.status === 'healthy' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} 
                              style={{ height: `${Math.max(15, normalizedValue)}%` }}
                            ></div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className={`border rounded-md p-4 ${alert.resolved ? 'border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-900'}`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon 
                        className={`h-5 w-5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        } ${alert.resolved ? 'opacity-50' : ''}`} 
                        aria-hidden="true" 
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${alert.resolved ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {alert.title}
                        {alert.resolved && <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(Resolved)</span>}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <p>{alert.description}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>{alert.timestamp.toLocaleString()}</span>
                        <span className="capitalize">{alert.severity} severity</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <a href="/admin/dashboard/system/alerts" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              View all alerts u2192
            </a>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Maintenance Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Run Diagnostics
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Clear Cache
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Backup Database
          </button>
        </div>
      </div>
    </div>
  );
}
