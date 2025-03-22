'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { Role } from '../../lib/types/roles';

interface UserProfile {
  id: string;
  role: Role;
  displayName?: string;
  email: string;
  avatar_url?: string;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, any>;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { signIn, user } = useAuth();
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Call signIn without specifying a role - any non-admin role will work
      await signIn(email, password);
      
      // If we get here, login was successful
      console.log('Login successful, redirecting to dashboard');
      
      // Set flag to prevent redirect loops
      setIsRedirecting(true);
      
      // Use router.replace instead of push to avoid adding to history
      // Redirect based on user role
      if (user?.role === 'representative') {
        router.replace('/representative/dashboard');
      } else if (user?.role === 'staff_member') {
        router.replace('/staff/dashboard');
      } else {
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      setLoading(false);
    }
  };
  
  // Prevent redirect loops
  useEffect(() => {
    if (user && !isRedirecting) {
      // Redirect based on role
      if (user.role === 'representative') {
        router.replace('/representative/dashboard');
      } else if (user.role === 'staff_member') {
        router.replace('/staff/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, router, isRedirecting]);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>{successMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
