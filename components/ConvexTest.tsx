'use client';

import { useState, useEffect } from 'react';
import { useConvexAuth } from 'convex/react';
import { useAuth } from '../context/AuthContext';

export default function ConvexTest() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const auth = useAuth();
  const [convexState, setConvexState] = useState<any>(null);
  
  useEffect(() => {
    console.log('ConvexTest component mounted');
    console.log('ConvexAuth state:', { isAuthenticated, isLoading });
    console.log('AuthContext state:', auth);
    
    // Check for window.__CONVEX_STATE
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore - This is a private API but useful for debugging
        const state = window.__CONVEX_STATE;
        setConvexState({
          exists: !!state,
          hasClient: !!(state?.client),
          hasAuth: !!(state?.auth),
        });
      } catch (e) {
        console.error('Error accessing Convex state:', e);
        setConvexState({ error: String(e) });
      }
    }
  }, [isAuthenticated, isLoading, auth]);

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Convex Client Status</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">ConvexAuth Hook</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li className="flex">
              <span className="font-medium w-32">Is Loading:</span>
              <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                {isLoading ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="flex">
              <span className="font-medium w-32">Is Authenticated:</span>
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">AuthContext</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li className="flex">
              <span className="font-medium w-32">Convex Available:</span>
              <span className={auth.convexAvailable ? 'text-green-600' : 'text-red-600'}>
                {auth.convexAvailable ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="flex">
              <span className="font-medium w-32">Loading:</span>
              <span className={auth.loading ? 'text-yellow-600' : 'text-green-600'}>
                {auth.loading ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="flex">
              <span className="font-medium w-32">User:</span>
              <span className={auth.user ? 'text-green-600' : 'text-gray-600'}>
                {auth.user ? auth.user.email : 'Not logged in'}
              </span>
            </li>
            {auth.error && (
              <li className="flex">
                <span className="font-medium w-32">Error:</span>
                <span className="text-red-600">{auth.error}</span>
              </li>
            )}
          </ul>
        </div>
        
        {convexState && (
          <div>
            <h3 className="font-medium text-gray-700">Convex Internal State</h3>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-24">
              {JSON.stringify(convexState, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
