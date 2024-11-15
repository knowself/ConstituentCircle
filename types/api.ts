/**
 * API Types and Interfaces
 * 
 * This file contains TypeScript type definitions for API responses and data models
 * used throughout the application.
 */

/**
 * Generic API Response wrapper
 * @template T The type of data contained in the response
 */
export interface ApiResponse<T> {
    /** The response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Response message */
    message: string;
  }
  
  /**
   * Error Response structure
   */
  export interface ErrorResponse {
    /** Error message */
    error: string;
    /** HTTP status code */
    status: number;
    /** Additional error details */
    details?: unknown;
  }
  
  /**
   * User model representing both constituents and representatives
   */
  export interface User {
    /** Unique identifier */
    id: string;
    /** User's full name */
    name: string;
    /** User's email address */
    email: string;
    /** User's role in the system */
    role: 'constituent' | 'representative';
    /** Timestamp of last activity */
    lastActive?: string;
    /** User preferences */
    preferences?: UserPreferences;
  }
  
  /**
   * User preferences configuration
   */
  export interface UserPreferences {
    /** Preferred theme */
    theme?: 'light' | 'dark' | 'system';
    /** Email notification settings */
    notifications?: {
      email: boolean;
      push: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
    };
  }
  
  /**
   * Communication record between constituent and representative
   */
  export interface Communication {
    /** Unique identifier */
    id: string;
    /** User ID who sent the message */
    senderId: string;
    /** User ID who receives the message */
    receiverId: string;
    /** Message content */
    content: string;
    /** Timestamp of the message */
    timestamp: string;
    /** Current status of the message */
    status: 'draft' | 'sent' | 'delivered' | 'read';
    /** Message type */
    type: 'direct' | 'broadcast' | 'automated';
    /** Optional metadata */
    metadata?: Record<string, unknown>;
  }
  
  /**
   * Representative profile information
   */
  export interface Representative {
    /** Unique identifier */
    id: string;
    /** Representative's full name */
    name: string;
    /** Political district */
    district: string;
    /** Political party affiliation */
    party: string;
    /** Contact information */
    contactInfo: {
      email: string;
      phone?: string;
      office?: string;
      website?: string;
    };
    /** Term information */
    term?: {
      start: string;
      end: string;
    };
  }
  
  /**
   * Constituent profile information
   */
  export interface Constituent {
    /** Unique identifier */
    id: string;
    /** Constituent's full name */
    name: string;
    /** Residential district */
    district: string;
    /** Communication preferences */
    preferences: {
      /** Preferred method of communication */
      communicationMethod: 'email' | 'phone' | 'mail';
      /** Topics of interest */
      topics: string[];
      /** Preferred contact times */
      contactTimes?: {
        start: string;
        end: string;
        timezone: string;
      };
    };
  }
  
  /**
   * AI Analysis result for communications
   */
  export interface AIAnalysis {
    /** Unique identifier */
    id: string;
    /** Reference to the communication */
    communicationId: string;
    /** Sentiment analysis results */
    sentiment: {
      score: number;
      label: 'positive' | 'neutral' | 'negative';
    };
    /** Key topics identified */
    topics: string[];
    /** Generated summary */
    summary: string;
    /** Suggested actions */
    suggestedActions?: string[];
  }
  