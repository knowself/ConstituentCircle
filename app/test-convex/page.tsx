'use client';

import ConvexTest from "src/components/ConvexTest";

export default function TestConvexPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Convex Test Page</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Environment Variables:</h2>
        <pre className="bg-gray-100 p-2 rounded mt-2">
          {JSON.stringify(
            {
              NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
              windowENV: typeof window !== 'undefined' ? window.ENV : undefined,
            },
            null,
            2
          )}
        </pre>
      </div>
      <div>
        <ConvexTest />
      </div>
    </div>
  );
}
