import React, { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SimpleHeader from './components/SimpleHeader';

export default function Home() {
  return (
    <div className="min-h-screen">
      <SimpleHeader />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
            <div className="text-sm text-gray-500 text-center">Loading...</div>
          </div>
        </div>}>
          <HeroSection />
          <FeaturesSection />
        </Suspense>
      </main>
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-900">
            &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
