'use client';

import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a simple test page to verify that basic routing is working.</p>
      <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
    </div>
  );
}