'use client';

import { useState, useEffect } from 'react';

export default function ConvexDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // For server-side rendering, return a placeholder
  if (typeof window === 'undefined') {
    return <div className="p-4 border rounded bg-gray-50 text-sm">Loading debug info...</div>;
  }
  
  useEffect(() => {
    try {
      // @ts-ignore - accessing internal Convex state for debugging
      const convexState = window.__CONVEX_STATE;
      
      setDebugInfo({
        timestamp: new Date().toISOString(),
        hasConvexState: !!convexState,
        hasClient: !!(convexState?.client),
        hasAuth: !!(convexState?.auth),
        envVars: {
          NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
          windowENV: window.ENV
        }
      });
    } catch (e) {
      setDebugInfo({
        error: String(e),
        timestamp: new Date().toISOString()
      });
    }
    
    // Update debug info every 5 seconds
    const interval = setInterval(() => {
      try {
        // @ts-ignore - accessing internal Convex state for debugging
        const convexState = window.__CONVEX_STATE;
        
        setDebugInfo((prev: any) => ({
          ...prev,
          timestamp: new Date().toISOString(),
          hasConvexState: !!convexState,
          hasClient: !!(convexState?.client),
          hasAuth: !!(convexState?.auth),
        }));
      } catch (e) {
        // Do nothing on error during interval updates
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!debugInfo) {
    return <div className="p-4 border rounded bg-gray-50 text-sm">Loading debug info...</div>;
  }
  
  return (
    <div className="p-4 border rounded bg-gray-50 text-sm">
      <h3 className="font-medium mb-2">Convex Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-40">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
