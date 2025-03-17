// Update your UserProfile interface to match the actual structure
interface UserProfile {
  id: string;
  email: string;
  avatar_url?: string;
  firstName?: string;
  lastName?: string;
  user_metadata?: {
    role?: string; // Add role or other properties as needed
  };
}

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type Communication = {
  id: string;
  representative_id: string;
  type: CommunicationType;
  channel: 'email' | 'sms' | 'phone' | 'chat';
  visibility: 'public' | 'private' | 'group';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
};

export type CommunicationType = 'email' | 'sms' | 'phone' | 'chat';

export type CommunicationDirection = 'inbound_call' | 'inbound_email' | 'inbound_sms' | 'outbound_call' | 'outbound_email' | 'outbound_sms';

export type CommunicationQuery = Partial<Communication> & {
  representative_id?: string;
  subject?: string;
  content?: string;
  type?: CommunicationType;
  direction?: CommunicationDirection;
  _limit?: number;
  _sort?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Analytics = {
  id: string;
  metrics: { [key: string]: number };
  engagement: { [key: string]: number };
  trends: { [key: string]: number };
  timestamp: Date;
  // Add other properties as needed
};