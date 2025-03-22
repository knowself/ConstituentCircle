'use client';

import { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import ConvexTest from "../../components/ConvexTest";
import ConvexDebug from "../../components/ConvexDebug";

export default function ConvexTestPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState<any>(null);
  
  // Create a new client instance for testing
  const createClient = () => {
    if (typeof window === 'undefined') return null;
    
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
    if (!url) return null;
    
    try {
      const client = new ConvexReactClient(url);
      setClientInfo({
        created: true,
        url
      });
      return client;
    } catch (error) {
      console.error('Failed to create client:', error);
      setClientInfo({
        created: false,
        error: String(error)
      });
      return null;
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEnvInfo({
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
        windowENV: window.ENV,
        nodeEnv: process.env.NODE_ENV,
        publicEnv: process.env.NEXT_PUBLIC_ENV
      });
    }
  }, []);
  
  const client = createClient();
  
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Convex Diagnostic Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(envInfo, null, 2)}
          </pre>
        </div>
        
        <div className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Client Initialization</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(clientInfo, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Global ConvexProvider Test</h2>
          <p className="mb-3 text-sm text-gray-600">This uses the app-wide ConvexProvider from layout.tsx</p>
          <div className="bg-gray-100 p-3 rounded">
            <ConvexTest />
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Local ConvexProvider Test</h2>
          <p className="mb-3 text-sm text-gray-600">This creates its own ConvexProvider instance</p>
          <div className="bg-gray-100 p-3 rounded">
            {client ? (
              <ConvexProvider client={client}>
                <ConvexTest />
              </ConvexProvider>
            ) : (
              <div className="text-red-500">Failed to create Convex client</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 border rounded-lg p-4 bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Convex Debug Information</h2>
        <ConvexDebug />
      </div>
      
      <div className="mt-6 border rounded-lg p-4 bg-white shadow">
        <h2 className="text-xl font-semibold mb-3">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Verify that <code className="bg-gray-100 px-1">NEXT_PUBLIC_CONVEX_URL</code> is set in <code className="bg-gray-100 px-1">.env.local</code></li>
          <li>Check that the ConvexClientProvider is properly initialized in <code className="bg-gray-100 px-1">app/layout.tsx</code></li>
          <li>Ensure that the Convex client is created only once and shared across the application</li>
          <li>Verify that all components using Convex hooks are descendants of ConvexProvider</li>
          <li>Check browser console for any initialization errors</li>
        </ol>
      </div>
    </div>
  );
}
