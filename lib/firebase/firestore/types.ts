import { Timestamp } from 'firebase/firestore';

// Company staff roles - completely separate from office staff
export type CompanyRole = 
  | 'company_admin'     // Full access to all features and settings
  | 'company_manager'   // Access to manage billing, subscriptions, and major issues
  | 'company_support'   // Limited support access, can only help when requested
  | 'company_analyst';  // Read-only access to platform-wide analytics

// Representative office permanent roles
export type PermanentRepRole = 
  | 'representative'    // The elected official
  | 'chief_of_staff'   // Can manage all aspects of the office
  | 'communications_director' // Manages all communications
  | 'office_admin'     // Administrative access to office settings
  | 'staff_member';    // Basic staff access

// Campaign and temporary staff roles
export type TemporaryRepRole =
  | 'campaign_manager'      // Manages campaign communications and staff
  | 'campaign_coordinator'  // Coordinates campaign activities
  | 'field_organizer'      // Manages field operations
  | 'volunteer_coordinator' // Manages volunteers
  | 'temp_staff'           // Temporary general staff
  | 'intern'               // Interns
  | 'volunteer';           // Campaign volunteers

export type RepRole = PermanentRepRole | TemporaryRepRole;
export type Role = CompanyRole | RepRole;

// Staff employment types
export type EmploymentType =
  | 'permanent'    // Regular full-time staff
  | 'temporary'    // Temporary staff
  | 'campaign'     // Campaign-specific staff
  | 'seasonal'     // Seasonal staff (e.g., summer interns)
  | 'volunteer';   // Volunteers

// Base permissions that any role can have
export type Permission =
  // Communications
  | 'communications.create'
  | 'communications.edit'
  | 'communications.delete'
  | 'communications.send'
  | 'communications.view'
  | 'communications.approve'
  // Constituent Management
  | 'constituents.manage'
  | 'constituents.view'
  | 'constituents.export'
  // Campaign Management
  | 'campaign.manage'
  | 'campaign.view'
  | 'campaign.create_events'
  | 'campaign.manage_volunteers'
  // Analytics
  | 'analytics.view'
  | 'analytics.export'
  // Staff Management
  | 'staff.invite'
  | 'staff.remove'
  | 'staff.manage_roles'
  | 'staff.manage_temp'
  // Settings
  | 'settings.view'
  | 'settings.edit';

export interface StaffMember {
  uid: string;
  officeId: string;
  role: RepRole;
  employmentType: EmploymentType;
  permissions: Permission[];
  startDate: Timestamp;
  endDate?: Timestamp;  // Required for temporary staff
  supervisor?: string;  // UID of supervising staff member
  metadata?: {
    department?: string;
    title?: string;
    campaign?: string;  // For campaign staff
    notes?: string;
  };
}

export interface OfficeSettings {
  id: string;
  representativeId: string;
  name: string;
  district: string;
  staffManagement: {
    temporaryStaff: {
      enabled: boolean;
      maxDuration: number;  // Maximum duration in days
      requireApproval: boolean;
      approvers: RepRole[];
      autoExpire: boolean;  // Automatically expire temporary access
    };
    campaignMode: {
      enabled: boolean;
      startDate?: Timestamp;
      endDate?: Timestamp;
      specialRoles: TemporaryRepRole[];
      defaultPermissions: {
        [K in TemporaryRepRole]: Permission[];
      };
    };
    permanentStaff: {
      roles: PermanentRepRole[];
      permissions: {
        [K in PermanentRepRole]: Permission[];
      };
    };
  };
  workflowSettings: {
    requireApproval: boolean;
    approvalChain: RepRole[];
    notifyRepresentative: boolean;
    tempStaffRestrictions: {
      requireSupervisor: boolean;
      restrictedPermissions: Permission[];
      maxActiveTemp: number;  // Maximum number of active temporary staff
    };
  };
  communicationDefaults: {
    templates: string[];
    signatures: string[];
    approvalThreshold: number;
    tempStaffSettings: {
      requireReview: boolean;
      reviewers: RepRole[];
      restrictedChannels: string[];
    };
  };
  metadata?: {
    lastUpdated: Timestamp;
    updatedBy: string;
    version: number;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  employmentType?: EmploymentType;
  companyRole?: CompanyRole;
  officeId?: string;     // Links to the representative's office
  representativeId?: string; // For staff members, links to their representative
  permissions: Permission[];  // Explicit permissions for this user
  district?: string;     // For representatives
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastRequest?: Timestamp;
  employment?: {
    startDate: Timestamp;
    endDate?: Timestamp;
    supervisor?: string;
    department?: string;
    title?: string;
    campaign?: string;
  };
  metadata?: {
    lastLogin?: Timestamp;
    loginCount?: number;
    deviceInfo?: string;
    department?: string;
    title?: string;
    temporaryAccess?: {  // For temporary staff and permissions
      grantedBy: string;
      role: TemporaryRepRole;
      permissions: Permission[];
      startDate: Timestamp;
      endDate: Timestamp;
      campaign?: string;
      supervisor?: string;
    };
    socialProfiles?: {
      facebook?: string;
      twitter?: string;
      whatsapp?: string;
    };
  };
}

export interface Representative {
  uid: string;
  profileId: string;
  district: string;
  office: string;
  party: string;
  subscriptionTier: 'monthly' | 'quarterly' | 'annual';
  subscriptionStatus: 'active' | 'pending' | 'cancelled';
  term: {
    start: Timestamp;
    end: Timestamp;
  };
  staff: {
    members: string[]; // UIDs of staff members
    roles: Record<string, 'admin' | 'manager' | 'coordinator'>;
  };
  contactInfo: {
    office: string;
    phone: string;
    email: string;
    alternatePhone?: string;
    alternateEmail?: string;
    website?: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      whatsapp?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  preferences: {
    communicationFrequency: 'daily' | 'weekly' | 'monthly';
    notificationSettings: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    timezone?: string;
    language?: string;
    autoResponders?: {
      enabled: boolean;
      templates: Record<string, string>;
    };
  };
  constituencyGroups: {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
  }[];
  status: 'active' | 'inactive' | 'pending';
  lastRequest?: Timestamp;
}

export interface Communication {
  id: string;
  representativeId: string;
  senderId: string;
  senderRole: Role;
  recipientId?: string;
  recipientGroupId?: string;
  type: 'broadcast' | 'direct' | 'group' | 'constituent-to-constituent';
  direction: 'outbound' | 'inbound' | 'internal' | 'peer';
  channel: 'email' | 'sms' | 'whatsapp' | 'facebook' | 'twitter' | 'other';
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  visibility: 'public' | 'private' | 'group';
  scheduledFor?: Timestamp;
  sentAt?: Timestamp;
  parentId?: string; // For threaded communications
  metadata: {
    templateId?: string;
    campaign?: string;
    tags: string[];
    version?: number;
    aiGenerated?: boolean;
    sentiment?: 'positive' | 'neutral' | 'negative';
    platform?: string;
    socialMetrics?: {
      likes?: number;
      shares?: number;
      comments?: number;
    };
    location?: {
      district?: string;
      precinct?: string;
    };
  };
  analytics: {
    delivered: number;
    opened: number;
    clicked: number;
    responded: number;
    bounced?: number;
    complaints?: number;
    engagement?: {
      likes: number;
      shares: number;
      comments: number;
      reach: number;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastRequest?: Timestamp;
}

export interface ConstituentGroup {
  id: string;
  representativeId: string;
  name: string;
  description?: string;
  type: 'geographic' | 'demographic' | 'interest' | 'custom';
  members: string[]; // Constituent UIDs
  moderators: string[]; // Staff or trusted constituent UIDs
  settings: {
    allowMemberPosts: boolean;
    requireModeration: boolean;
    autoJoinRules?: Record<string, any>;
  };
  metadata: {
    tags: string[];
    category?: string;
    district?: string;
    precinct?: string;
  };
  analytics: {
    totalMembers: number;
    activeMembers: number;
    postsCount: number;
    engagementRate: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SocialEngagement {
  id: string;
  representativeId: string;
  platform: 'facebook' | 'twitter' | 'whatsapp' | 'other';
  type: 'post' | 'share' | 'comment' | 'reaction';
  contentId: string; // Reference to the original Communication
  userId: string;
  content?: string;
  metadata: {
    platform: string;
    postType: string;
    parentId?: string;
    tags: string[];
  };
  analytics: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  representativeId: string;
  constituentId: string;
  content: string;
  type: 'email' | 'sms' | 'other';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  metadata: {
    platform: string;
    deviceInfo: string;
    ipAddress: string;
    userAgent?: string;
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
    priority?: 'low' | 'normal' | 'high';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastRequest?: Timestamp;
}

export interface Analytics {
  id: string;
  type: 'communication' | 'engagement' | 'performance';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: Record<string, number>;
  metadata: {
    filters: Record<string, string>;
    segments: string[];
    source?: string;
    version?: number;
    generatedBy?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastRequest?: Timestamp;
}

export interface Settings {
  id: string;
  category: 'system' | 'communication' | 'security';
  values: Record<string, any>;
  lastUpdatedBy: string;
  updatedAt: Timestamp;
  lastRequest?: Timestamp;
  metadata?: {
    description?: string;
    version?: number;
    environment?: 'development' | 'staging' | 'production';
  };
}
