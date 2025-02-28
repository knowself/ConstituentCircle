// Communication types used across the application
export type CommunicationType = 'broadcast' | 'direct' | 'group' | 'constituent-to-constituent';
export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'facebook' | 'twitter' | 'other';
export type CommunicationDirection = 'inbound' | 'outbound';

export interface SocialEngagement {
  type: 'reaction' | 'share' | 'comment' | 'post';
  platform: string;
  analytics: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  metadata?: Record<string, any>;
}

export interface Communication {
  id?: string;
  subject: string;
  content: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  channel: CommunicationChannel;
  visibility: 'public' | 'private' | 'group';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  scheduledFor?: Date;
  metadata?: {
    tags: string[];
    platform: string;
    aiGenerated: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
  analytics?: {
    engagement?: {
      likes: number;
      shares: number;
      comments: number;
      reach: number;
    };
  };
}
