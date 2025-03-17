'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function AdminTools() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Convex queries and mutations
  const adminUserInfo = useQuery(api.auth.checkAdminUser);
  const setAdminPassword = useMutation(api.auth.setAdminPassword);
  
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const result = await setAdminPassword({ password });
      if (result) {
        setMessage('Admin password set successfully');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Failed to set admin password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Tools</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin User Status</h2>
        
        {adminUserInfo ? (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Admin exists:</span>{' '}
              <span className={adminUserInfo.exists ? 'text-green-500' : 'text-red-500'}>
                {adminUserInfo.exists ? 'Yes' : 'No'}
              </span>
            </p>
            {adminUserInfo.exists && (
              <>
                <p>
                  <span className="font-medium">Admin email:</span>{' '}
                  <span>{adminUserInfo.email}</span>
                </p>
                <p>
                  <span className="font-medium">Has password set:</span>{' '}
                  <span className={adminUserInfo.hasPassword ? 'text-green-500' : 'text-red-500'}>
                    {adminUserInfo.hasPassword ? 'Yes' : 'No'}
                  </span>
                </p>
              </>
            )}
          </div>
        ) : (
          <p>Loading admin information...</p>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Set Admin Password</h2>
        
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Set Password
          </button>
          
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
