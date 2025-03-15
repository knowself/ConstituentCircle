import { api } from '../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

// Create a client for server-side operations
export const CONVEX_URL = process.env.NEXT_PUBLIC_ENV === "prod"
  ? process.env.NEXT_PUBLIC_CONVEX_URL_PROD
  : process.env.NEXT_PUBLIC_CONVEX_URL_DEV;

const convex = new ConvexHttpClient(CONVEX_URL!);

export class DatabaseService {
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