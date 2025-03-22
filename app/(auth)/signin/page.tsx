'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';
import Header from '../../../components/Header';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Create a separate client component for Convex interactions
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Try to use Convex action if available, otherwise fallback to fetch
  const convexLogin = useAction(api.auth.loginWithEmail);
  
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // First try using Convex action
      try {
        const result = await convexLogin({ email, password });
        // Store token in localStorage
        localStorage.setItem('sessionToken', result.token);
        // Redirect to dashboard
        router.push('/dashboard');
        return;
      } catch (convexError: any) {
        console.log('Convex login failed, falling back to API route:', convexError);
        // Fall back to fetch API if Convex action fails
      }
      
      // Fallback: Use fetch to call the API route
      console.log('Attempting to login via API route');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('API response status:', response.status, response.statusText);
      
      // Safely parse the JSON response
      let data;
      try {
        data = await response.json();
        console.log('API response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Unable to process the server response. Please try again.');
      }
      
      if (!response.ok) {
        // Display the specific error message from the server
        const errorMessage = data?.message || 'Login failed. Please check your credentials and try again.';
        throw new Error(errorMessage);
      }
      
      // Store token in localStorage
      if (data?.token) {
        localStorage.setItem('sessionToken', data.token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server. Missing authentication token.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                  {error.includes('endpoint not found') && (
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>The authentication service may be temporarily unavailable. Please try again later or contact support if the issue persists.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 dark:text-blue-500 hover:text-indigo-700 dark:hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignIn() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header showMobileMenu={true} />
      
      <div className="flex flex-grow flex-col justify-center py-8 sm:px-6 lg:px-8 pt-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <UserIcon className="h-12 w-12 text-indigo-600 dark:text-blue-500" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to Constituent Circle
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/signup" className="font-medium text-indigo-600 dark:text-blue-500 hover:text-indigo-500 dark:hover:text-blue-400">
              Create a New Account
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <SignInForm />
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
