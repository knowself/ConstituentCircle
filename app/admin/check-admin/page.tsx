'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function CheckAdminUser() {
  const [email, setEmail] = useState('joe@derivativegenius.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Use the checkUser mutation
  const checkUser = useMutation(api.checkUser.checkUser);
  
  const handleCheck = async () => {
    setLoading(true);
    try {
      const checkResult = await checkUser({ email });
      setResult(checkResult);
    } catch (error: any) {
      console.error('Error checking user:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Check on load
    handleCheck();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Check Admin User</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="bg-indigo-600 dark:bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>
        
        {result && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">User Check Results:</h2>
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
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
