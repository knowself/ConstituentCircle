'use client';

import { ConvexProvider, ConvexReactClient } from "convex/react";
import ConvexTest from "../../components/ConvexTest";

export default function TestWrapperPage() {
  // Create a new client instance for this page only
  const createClient = () => {
    if (typeof window === 'undefined') return null;
    
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
    if (!url) return null;
    
    try {
      return new ConvexReactClient(url);
    } catch (error) {
      console.error('Failed to create client:', error);
      return null;
    }
  };
  
  const client = createClient();
  
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }
  
  if (!client) {
    return <div>Failed to initialize Convex client</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Convex Test Wrapper Page</h1>
      <p className="mb-4">This page creates its own Convex client instance.</p>
      
      <ConvexProvider client={client}>
        <ConvexTest />
      </ConvexProvider>
    </div>
  );
}
