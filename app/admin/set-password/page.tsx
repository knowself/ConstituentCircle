'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
// Removed Header import - using Navigation from root layout

export default function SetAdminPassword() {
  const [email, setEmail] = useState('joe@derivativegenius.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Use the setPassword mutation
  const setPasswordMutation = useMutation(api.auth.setPassword);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const result = await setPasswordMutation({
        email,
        password,
      });
      
      if (result.success) {
        setMessage('Password set successfully!');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation is provided by the root layout */}
      
      <div className="flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Set Admin Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Set a new password for your admin account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            {message && (
              <div className={`rounded-md p-4 ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'}`}>
                <p className="text-sm">{message}</p>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Setting password...' : 'Set Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
