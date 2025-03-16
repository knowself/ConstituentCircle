import { api } from '../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

// Create a client for server-side operations
export const CONVEX_URL = process.env.NEXT_PUBLIC_ENV === "prod"
  ? process.env.NEXT_PUBLIC_CONVEX_URL_PROD
  : process.env.NEXT_PUBLIC_CONVEX_URL_DEV;

const convex = new ConvexHttpClient(CONVEX_URL!);

export class DatabaseService<T> {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  async getAll(): Promise<T[]> {
    const result = await convex.query(api[this.table].getAll); 
    return result;
  }

  async query<U>(filters: Partial<U>): Promise<U[]> {
    if (this.table === 'communications') {
      const representativeId = (filters as any).representativeId;
      const limit = (filters as any)._limit || 10; // Default to 10 if not specified
      
      console.log('Querying communications with:', { representativeId, limit });
      
      try {
        const result = await convex.query(api.communications.getRecentCommunications, { 
          representativeId, 
          limit 
        });
        
        console.log('Query result:', result);
        return result as any as U[];
      } catch (error) {
        console.error('Error querying communications:', error);
        throw error;
      }
    } else {
      throw new Error(`Querying table ${this.table} is not supported.`);
    }
  }

  static async getUser(userId: string) {
    return await convex.query(api.users.getById, { userId });
  }
  
  static async getUserByEmail(email: string) {
    return await convex.query(api.users.getByEmail, { email });
  }
  
  // Add other methods as needed
}

// Export individual methods for backward compatibility
export const getUser = DatabaseService.getUser;