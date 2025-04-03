'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import the context hook
import type { User } from '@/hooks/useAuth'; // Import the User type separately

export const dynamic = 'force-dynamic'; 
 
// This page checks the logged-in user's role and redirects
export default function CheckAdminPage() {
  // Hooks are now safe to call
  const { 
    user, 
    isLoading: authLoading, 
    logout 
  } = useAuth(); 
  const router = useRouter();
   
  useEffect(() => {
    console.log(`CheckAdminPage Effect: authLoading=${authLoading}, userExists=${!!user}`);
 
    // Wait for Auth context to initialize
    if (authLoading) { 
      console.log('CheckAdminPage: Waiting for AuthContext initialization...');
      return; // Wait until initialization is complete
    } else {
        // If Auth is initialized but there's no user, redirect to login
        if (!user) {
          console.log('CheckAdminPage: Not authenticated, redirecting to login.');
          router.push('/login');
          return; // Important to return after push
        }
 
        // If user exists (i.e., authenticated), check the role
        console.log('CheckAdminPage: User authenticated', user);
        if (user && user.role === 'admin') { // Added extra user check for safety
          console.log('CheckAdminPage: User is admin, redirecting to admin dashboard.');
          router.push('/admin/dashboard');
        } else {
          console.log('CheckAdminPage: User is not admin, redirecting to constituent dashboard.');
          router.push('/constituent/dashboard');
        }
        // Redirect happens above, no need for further action here
    }
 
  }, [authLoading, user, router]); // Dependencies are auth state and router
 
  // Loading state while Auth context is loading/initializing
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Checking authentication status...</div>;
  }
 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Check Admin User</h1>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Debugging Tips:</h2>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
            <li>If <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">exists</code> is false, the user doesn't exist in the database.</li>
            <li>If <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">hasPassword</code> is false, the user exists but has no password set.</li>
            <li>Check the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">role</code> field to ensure it's set to "admin".</li>
            <li>The <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">fields</code> object shows all available fields on the user record.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
