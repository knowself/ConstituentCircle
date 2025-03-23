'use client';

import { useEffect } from 'react';

export default function HomeContent() {
  useEffect(() => {
    console.log('HomeContent mounted'); // Debug log
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Constituent Circle
        </h1>
        <p className="text-center text-xl mb-8">
          Modern platform for constituent communications and engagement
        </p>
        {/* Add more content sections here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Constituent Management</h3>
            <p>Efficiently manage and engage with your constituents using our advanced platform.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Communication Tools</h3>
            <p>Modern tools for effective constituent communications and engagement.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
            <p>Data-driven insights to better understand and serve your constituency.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
