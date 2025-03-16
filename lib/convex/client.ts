import { ConvexReactClient } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';

// Create a singleton for the Convex client that's only initialized on the client side
let convexReactClient: ConvexReactClient | null = null;
let convexHttpClient: ConvexHttpClient | null = null;

// Function to safely get the Convex React client
export function getConvexReactClient(): ConvexReactClient | null {
  // Only initialize on the client side
  if (typeof window !== 'undefined' && !convexReactClient) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        convexReactClient = new ConvexReactClient(convexUrl);
      } catch (error) {
        console.error('Failed to initialize Convex React client:', error);
        return null;
      }
    } else {
      console.warn('NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not be initialized.');
      return null;
    }
  }
  return convexReactClient;
}

// Function to safely get the Convex HTTP client
export function getConvexHttpClient(): ConvexHttpClient | null {
  // Only initialize on the client side
  if (typeof window !== 'undefined' && !convexHttpClient) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        convexHttpClient = new ConvexHttpClient(convexUrl);
      } catch (error) {
        console.error('Failed to initialize Convex HTTP client:', error);
        return null;
      }
    } else {
      console.warn('NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not be initialized.');
      return null;
    }
  }
  return convexHttpClient;
}
