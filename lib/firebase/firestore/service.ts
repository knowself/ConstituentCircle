import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentReference,
  QueryConstraint,
  writeBatch,
  runTransaction,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../index';
import {
  UserProfile,
  Representative,
  Message,
  Communication,
  Analytics,
  Settings,
} from './types';

// Generic type for all our models
type FirestoreModel = UserProfile | Representative | Message | Communication | Analytics | Settings;

class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string,
    public path: string
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

// Generic CRUD operations
export class FirestoreService<T extends FirestoreModel> {
  constructor(private collectionName: string) {}

  protected collection = collection(db, this.collectionName);

  protected handleError(error: any, operation: string, path: string): never {
    if (error instanceof FirestoreError) {
      throw new FirestoreError(
        error.message,
        error.code,
        operation,
        path
      );
    }
    throw new FirestoreError(
      'An unexpected error occurred',
      'unknown',
      operation,
      path
    );
  }

  async create(id: string, data: Omit<T, 'id'>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      this.handleError(error, 'create', `${this.collectionName}/${id}`);
    }
  }

  async get(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as T) : null;
    } catch (error) {
      this.handleError(error, 'get', `${this.collectionName}/${id}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      this.handleError(error, 'update', `${this.collectionName}/${id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      this.handleError(error, 'delete', `${this.collectionName}/${id}`);
    }
  }

  async query(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(this.collection, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      this.handleError(error, 'query', this.collectionName);
    }
  }

  async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    id: string;
    data?: Partial<T>;
  }>): Promise<void> {
    const batch = writeBatch(db);
    try {
      operations.forEach(({ type, id, data }) => {
        const docRef = doc(this.collection, id);
        switch (type) {
          case 'create':
            batch.set(docRef, {
              ...data,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...data,
              updatedAt: Timestamp.now(),
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });
      await batch.commit();
    } catch (error) {
      this.handleError(error, 'batchWrite', this.collectionName);
    }
  }

  async runTransaction<TResult>(
    updateFunction: (transaction: any) => Promise<TResult>
  ): Promise<TResult> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      this.handleError(error, 'transaction', this.collectionName);
    }
  }
}

// Specific services for each model
export class UserProfileService extends FirestoreService<UserProfile> {
  constructor() {
    super('users');
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    const users = await this.query([where('email', '==', email), limit(1)]);
    return users[0] || null;
  }
}

export class RepresentativeService extends FirestoreService<Representative> {
  constructor() {
    super('representatives');
  }

  async getByDistrict(district: string): Promise<Representative[]> {
    return this.query([where('district', '==', district)]);
  }
}

export class MessageService extends FirestoreService<Message> {
  constructor() {
    super('messages');
  }

  async getByRepresentative(repId: string, status?: Message['status']): Promise<Message[]> {
    const constraints: QueryConstraint[] = [
      where('representativeId', '==', repId),
      orderBy('createdAt', 'desc'),
    ];
    if (status) {
      constraints.push(where('status', '==', status));
    }
    return this.query(constraints);
  }
}

export class CommunicationService extends FirestoreService<Communication> {
  constructor() {
    super('communications');
  }

  async getDrafts(repId: string): Promise<Communication[]> {
    return this.query([
      where('representativeId', '==', repId),
      where('status', '==', 'draft'),
      orderBy('updatedAt', 'desc'),
    ]);
  }

  async getScheduled(repId: string): Promise<Communication[]> {
    return this.query([
      where('representativeId', '==', repId),
      where('status', '==', 'scheduled'),
      orderBy('scheduledFor', 'asc'),
    ]);
  }
}

export class AnalyticsService extends FirestoreService<Analytics> {
  constructor() {
    super('analytics');
  }

  async getByPeriod(period: Analytics['period'], type: Analytics['type']): Promise<Analytics[]> {
    return this.query([
      where('period', '==', period),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
    ]);
  }
}

export class SettingsService extends FirestoreService<Settings> {
  constructor() {
    super('settings');
  }

  async getByCategory(category: Settings['category']): Promise<Settings[]> {
    return this.query([where('category', '==', category)]);
  }
}

// Export service instances
export const userProfileService = new UserProfileService();
export const representativeService = new RepresentativeService();
export const messageService = new MessageService();
export const communicationService = new CommunicationService();
export const analyticsService = new AnalyticsService();
export const settingsService = new SettingsService();
