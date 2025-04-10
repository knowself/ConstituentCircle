'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Use context hook
import type { User } from '@/hooks/useAuth'; // Import User type
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
// Removed Header import - using Navigation from root layout

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { user, login, isLoading: authIsLoading } = useAuth(); // Changed signIn to login

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (!mounted || isRedirecting) return;
    
    const checkAuthStatus = async () => {
      try {
        // Check if we have a logout parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const isLogout = urlParams.get('logout') === 'true';
        const logoutMessage = urlParams.get('message');
        
        // If we're coming from a logout, don't redirect back to dashboard
        if (isLogout) {
          // Set success message
          setSuccessMessage(logoutMessage || 'You have been successfully logged out.');
          
          // Clean the URL by removing the logout parameter
          if (window.history.replaceState) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
          return;
        }
        
        // If still loading auth state, wait
        if (authIsLoading) return; // Use the isLoading state from useAuth
        
        // If user is already authenticated and is an admin, redirect to dashboard
        // Only redirect if we have a valid session token in localStorage
        const sessionToken = localStorage.getItem('sessionToken');
        if (user && user.role === 'admin' && sessionToken) {
          console.log('User already logged in as admin, redirecting to dashboard');
          setIsRedirecting(true);
          router.replace('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkAuthStatus();
  }, [user, authIsLoading, mounted, router, isRedirecting]); // Add authIsLoading to dependency array

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Call the login function with email and password
      await login(email, password);
      
      // If we get here, login was successful
      console.log('Login successful, redirecting to dashboard');
      
      // Set flag to prevent redirect loops
      setIsRedirecting(true);
      
      // Use router.replace instead of push to avoid adding to history
      router.replace('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  // Wait for both component mount and auth state initialization
  if (!mounted || authIsLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-grow flex-col justify-center py-8 px-4">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">
              Only Constituent Circle admins can access this area
            </p>
          </div>
          <p className="text-center text-sm text-gray-600 mb-8">
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Normal Sign In
            </Link>
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              {successMessage && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}