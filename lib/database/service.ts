import { api } from '../../convex/_generated/api';
import { getConvexReactClient } from '../convex/client';

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
    const convex = getConvexReactClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return [];
    }

    const result = await convex.query(api[this.table].getAll); 
    return result;
  }

  // Added third generic RawResultType and optional mapper function
  async query<
    FilterType,
    ResultType,
    RawResultType = ResultType // Default RawResultType to ResultType if not provided
  >(
    filters: Partial<FilterType>,
    mapper?: (rawResult: RawResultType) => ResultType
  ): Promise<ResultType[]> {
    const convex = getConvexReactClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return [];
    }

    // Determine the actual Convex query function to call
    // Handle specific table overrides if necessary (like the previous communications logic)
    // For now, assume a generic query function exists for the table
    const queryFunction = api[this.table]?.query || api[this.table]?.getAll; // Simplified: adapt as needed
    if (!queryFunction) {
      console.error(`No query or getAll function found for table: ${this.table}`);
      return [];
    }

    // Fetch the raw results
    // Use 'any' for filters temporarily if type compatibility is complex
    const rawResults = (await convex.query(queryFunction as any, filters as any)) as RawResultType[];

    // If a mapper is provided, use it; otherwise, cast (assuming RawResultType = ResultType)
    if (mapper) {
      return rawResults.map(mapper);
    } else {
      // This cast assumes RawResultType is ResultType when no mapper is given
      return rawResults as unknown as ResultType[];
    }
  }

  static async getUser(userId: string) {
    const convex = getConvexReactClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return null;
    }

    return await convex.query(api.users.getById, { userId });
  }
  
  static async getUserByEmail(email: string) {
    const convex = getConvexReactClient();
    if (!convex) {
      console.warn('Database query attempted during server-side rendering or without a valid client');
      return null;
    }

    return await convex.query(api.users.getByEmail, { email });
  }
}

// Export individual methods for backward compatibility
export const getUser = DatabaseService.getUser;