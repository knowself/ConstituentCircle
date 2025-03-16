import { api } from '../../convex/_generated/api';
import { getConvexHttpClient } from '../convex/client';

// Create a client for server-side operations
export const CONVEX_URL = process.env.NEXT_PUBLIC_ENV === "prod"
  ? process.env.NEXT_PUBLIC_CONVEX_URL_PROD
  : process.env.NEXT_PUBLIC_CONVEX_URL_DEV;

export class DatabaseService<T> {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  async getAll(): Promise<T[]> {
    const convex = getConvexHttpClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return [];
    }

    const result = await convex.query(api[this.table].getAll); 
    return result;
  }

  async query<U>(filters: Partial<U>): Promise<U[]> {
    const convex = getConvexHttpClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return [];
    }

    if (this.table === 'communications') {
      const representativeId = (filters as any).representativeId;
      const limit = (filters as any)._limit || 10; // Default to 10 if not specified

      // Get recent communications for a representative
      const result = await convex.query(api.communications.getRecentCommunications, {
        representativeId,
        limit
      });

      return result as unknown as U[];
    }

    // Default query behavior
    const result = await convex.query(api[this.table].query, filters);
    return result as U[];
  }

  static async getUser(userId: string) {
    const convex = getConvexHttpClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return null;
    }

    return await convex.query(api.users.getById, { userId });
  }
  
  static async getUserByEmail(email: string) {
    const convex = getConvexHttpClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return null;
    }

    return await convex.query(api.users.getByEmail, { email });
  }
}

// Export individual methods for backward compatibility
export const getUser = DatabaseService.getUser;