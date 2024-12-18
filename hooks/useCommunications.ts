import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import {
  Communication,
  CommunicationType,
  CommunicationDirection,
  CommunicationChannel,
  SocialEngagement
} from '../lib/firebase/firestore/types';

interface UseCommunicationsOptions {
  type?: CommunicationType;
  direction?: CommunicationDirection;
  channel?: CommunicationChannel;
  limit?: number;
}

export const useCommunications = (options: UseCommunicationsOptions = {}) => {
  const { user } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch communications based on user role and filters
  const fetchCommunications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const communicationsRef = collection(db, 'communications');
      
      // Build query based on user role and access permissions
      let baseQuery = query(communicationsRef);

      // For representatives, show all communications in their hierarchy
      if (user.role === 'representative') {
        baseQuery = query(
          communicationsRef,
          where('representativeId', '==', user.uid)
        );
      }
      // For staff, show communications they have access to
      else if (user.role === 'staff') {
        baseQuery = query(
          communicationsRef,
          where('representativeId', '==', user.representativeId)
        );
      }
      // For constituents, show public communications and their direct messages
      else if (user.role === 'constituent') {
        baseQuery = query(
          communicationsRef,
          where('visibility', '==', 'public'),
          where('district', '==', user.district)
        );
      }

      // Apply filters
      if (options.type) {
        baseQuery = query(baseQuery, where('type', '==', options.type));
      }
      if (options.direction) {
        baseQuery = query(baseQuery, where('direction', '==', options.direction));
      }
      if (options.channel) {
        baseQuery = query(baseQuery, where('channel', '==', options.channel));
      }

      // Apply sorting and limit
      baseQuery = query(
        baseQuery,
        orderBy('createdAt', 'desc'),
        limit(options.limit || 50)
      );

      const snapshot = await getDocs(baseQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Communication));

      setCommunications(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, options]);

  // Create a new communication
  const createCommunication = async (data: Partial<Communication>) => {
    if (!user) throw new Error('User not authenticated');

    const newCommunication: Partial<Communication> = {
      ...data,
      senderId: user.uid,
      senderRole: user.role,
      representativeId: user.role === 'representative' ? user.uid : user.representativeId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'draft',
      metadata: {
        ...data.metadata,
        version: 1,
        tags: data.metadata?.tags || [],
      },
      analytics: {
        delivered: 0,
        opened: 0,
        clicked: 0,
        responded: 0,
      }
    };

    const docRef = await addDoc(collection(db, 'communications'), newCommunication);
    return { id: docRef.id, ...newCommunication };
  };

  // Handle social engagement
  const handleSocialEngagement = async (
    communicationId: string,
    engagement: Partial<SocialEngagement>
  ) => {
    if (!user) throw new Error('User not authenticated');

    const newEngagement: Partial<SocialEngagement> = {
      ...engagement,
      contentId: communicationId,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Create social engagement record
    await addDoc(collection(db, 'socialEngagements'), newEngagement);

    // Update communication analytics
    const communicationRef = doc(db, 'communications', communicationId);
    await updateDoc(communicationRef, {
      'analytics.engagement': {
        likes: engagement.analytics?.likes || 0,
        shares: engagement.analytics?.shares || 0,
        comments: engagement.analytics?.comments || 0,
        reach: engagement.analytics?.reach || 0,
      },
      updatedAt: Timestamp.now(),
    });
  };

  // Schedule a communication
  const scheduleCommunication = async (
    communicationId: string,
    scheduledFor: Date
  ) => {
    const communicationRef = doc(db, 'communications', communicationId);
    await updateDoc(communicationRef, {
      scheduledFor: Timestamp.fromDate(scheduledFor),
      status: 'scheduled',
      updatedAt: Timestamp.now(),
    });
  };

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  return {
    communications,
    loading,
    error,
    createCommunication,
    handleSocialEngagement,
    scheduleCommunication,
    refresh: fetchCommunications,
  };
};
