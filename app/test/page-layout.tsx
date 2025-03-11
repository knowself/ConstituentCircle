"use client";

import { ReactNode } from "react";

export default function TestPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="test-page-layout">
      <header className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">The Beginnings of Convex Integration</h1>
      </header>
      
      <main className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md my-6">
        {children}
      </main>
      
      <footer className="bg-gray-100 p-4 text-center border-t">
        <p className="text-gray-600">Test Page Environment - For Testing Purposes Only</p>
      </footer>
    </div>
  );
}