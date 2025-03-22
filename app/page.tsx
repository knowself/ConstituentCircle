'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
        <div className="text-sm text-gray-500 text-center">Loading...</div>
      </div>
    </div>
  );
}

// Main page component
export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Handle user redirection based on role
  React.useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'constituent':
          router.push('/constituent/dashboard');
          break;
        case 'company_admin':
        case 'company_manager':
        case 'company_support':
        case 'company_analyst':
          router.push('/company/dashboard');
          break;
        case 'representative':
          router.push('/representative/dashboard');
          break;
        case 'campaign_manager':
        case 'campaign_coordinator':
        case 'field_organizer':
        case 'volunteer_coordinator':
          router.push('/campaign/dashboard');
          break;
        case 'office_admin':
        case 'staff_member':
        case 'temp_staff':
        case 'intern':
          router.push('/office/dashboard');
          break;
        default:
          // For any new roles, default to constituent dashboard
          console.warn('Unknown role:', user.role);
          router.push('/constituent/dashboard');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <LoadingFallback />;
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <>
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
        </main>
        <footer className="bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
            </p>
            <div className="mt-4 text-center">
              <a href="/convex-test" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Convex Diagnostic Test Page
              </a>
            </div>
          </div>
        </footer>
      </>
    );
  }

  // Return null while redirecting authenticated users
  return <LoadingFallback />;
}
