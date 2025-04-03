'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ConvexTest() {
  const auth = useAuth();
  const [convexState, setConvexState] = useState<any>(null);
  
  useEffect(() => {
    console.log('ConvexTest component mounted');
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
  }, [auth]);

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Convex Client Status</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">AuthContext</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li className="flex">
              <span className="font-medium w-32">Loading:</span>
              <span className={auth.isLoading ? 'text-yellow-600' : 'text-green-600'}>
                {auth.isLoading ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="flex">
              <span className="font-medium w-32">Is Authenticated:</span>
              <span className={auth.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {auth.isAuthenticated ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="flex">
              <span className="font-medium w-32">User:</span>
              <span className={auth.user ? 'text-green-600' : 'text-gray-600'}>
                {auth.user ? auth.user.email : 'Not logged in'}
              </span>
            </li>
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
