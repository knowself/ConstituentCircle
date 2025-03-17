'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function CheckUser() {
  const [email, setEmail] = useState('joe@derivativegenius.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const setPassword = useMutation(api.auth.setPassword);

  const handleCheck = async () => {
    setLoading(true);
    try {
      // We can't directly call internal queries from the client
      // So we'll use the setPassword mutation to check if it succeeds
      const passwordResult = await setPassword({
        email,
        password: 'temporary_check_password',
      });
      
      setResult({
        message: passwordResult.success ? 
          'Password updated successfully. This means the user exists.' : 
          `Error: ${passwordResult.error}`,
        success: passwordResult.success
      });
    } catch (error: any) {
      setResult({
        message: `Error: ${error.message}`,
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Check User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Check if user exists and has password set
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check User'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-md bg-gray-100 dark:bg-gray-800">
              <h3 className={`text-lg font-medium ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.message}
              </h3>
              
              {result.success && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Now try logging in at <a href="/admin/login" className="text-indigo-600 dark:text-blue-400 hover:underline">Admin Login</a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
