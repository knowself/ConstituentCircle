/**
 * Analytics Types and Interfaces
 */

export interface Analytics {
  id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metrics: {
    totalCommunications: number;
    engagementRate: number;
    responseRate: number;
    averageResponseTime: number;
  };
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  demographics?: {
    age?: Record<string, number>;
    location?: Record<string, number>;
    interests?: string[];
  };
  trends: {
    topTopics: string[];
    sentimentScores: Record<string, number>;
    peakEngagementTimes: string[];
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metrics?: string[];
  dimensions?: string[];
}