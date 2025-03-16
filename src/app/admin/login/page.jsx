import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
// Try direct import with explicit path
import AuthNavHeader from '../components/authnavheader.jsx';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useMutation(api.auth.login);

  // Add this to suppress hydration warnings
  const [isClient, setIsClient] = useState(false);
  
  // Move console.log after isClient is defined
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call the Convex login mutation directly
      const result = await login({ email, password });
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Check if user has admin role
      if (result.userId) {
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    isClient && React.createElement(
      React.Fragment,
      null,
      React.createElement('div', { className: "bg-red-500 text-white p-1 text-xs" }, `Debug: Before Nav (isClient: ${String(isClient)})` ),
      React.createElement(AuthNavHeader, null),
      React.createElement('div', { className: "bg-green-500 text-white p-1 text-xs" }, "Debug: After Nav")
    ),
    React.createElement(
      'div',
      { className: "flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8" },
      isClient ? React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'div',
          { className: "sm:mx-auto sm:w-full sm:max-w-md" },
          React.createElement(
            'div',
            { className: "flex justify-center" },
            React.createElement(ShieldCheckIcon, { className: "h-12 w-12 text-indigo-600 dark:text-blue-500" })
          ),
          React.createElement(
            'h2',
            { className: "mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white" },
            "Admin Login"
          ),
          React.createElement(
            'p',
            { className: "mt-2 text-center text-sm text-gray-600 dark:text-gray-400" },
            "Secure access for administrators"
          )
        ),
        React.createElement(
          'div',
          { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md" },
          React.createElement(
            'div',
            { className: "bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10" },
            React.createElement(
              'form',
              { className: "space-y-6", onSubmit: handleLogin },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" },
                  "Email address"
                ),
                React.createElement(
                  'div',
                  { className: "mt-1" },
                  React.createElement('input', {
                    id: "email",
                    name: "email",
                    type: "email",
                    autoComplete: "email",
                    required: true,
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: "block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  })
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'label',
                  { htmlFor: "password", className: "block text-sm font-medium text-gray-700 dark:text-gray-300" },
                  "Password"
                ),
                React.createElement(
                  'div',
                  { className: "mt-1" },
                  React.createElement('input', {
                    id: "password",
                    name: "password",
                    type: "password",
                    autoComplete: "current-password",
                    required: true,
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  })
                )
              ),
              error && React.createElement(
                'div',
                { className: "rounded-md bg-red-50 dark:bg-red-900/30 p-4", role: "alert" },
                React.createElement(
                  'div',
                  { className: "flex" },
                  React.createElement(
                    'div',
                    { className: "ml-3" },
                    React.createElement(
                      'h3',
                      { className: "text-sm font-medium text-red-800 dark:text-red-200" },
                      "Error"
                    ),
                    React.createElement(
                      'div',
                      { className: "mt-2 text-sm text-red-700 dark:text-red-300" },
                      React.createElement('p', null, error)
                    )
                  )
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'button',
                  {
                    type: "submit",
                    disabled: loading,
                    className: "flex w-full justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  },
                  loading ? 'Signing in...' : 'Sign in'
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: "mt-6" },
          React.createElement(
            'div',
            { className: "relative" },
            React.createElement(
              'div',
              { className: "absolute inset-0 flex items-center" },
              React.createElement(
                'div',
                { className: "w-full border-t border-gray-300 dark:border-gray-600" }
              )
            ),
            React.createElement(
              'div',
              { className: "relative flex justify-center text-sm" },
              React.createElement(
                'span',
                { className: "bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400" },
                "Or"
              )
            )
          ),
          React.createElement(
            'div',
            { className: "mt-6 grid grid-cols-1 gap-3" },
            React.createElement(
              'div',
              null,
              React.createElement(
                Link,
                { href: "/auth/signin", className: "inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700" },
                "Regular User Login"
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                Link,
                { href: "/", className: "inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700" },
                "Return to Home"
              )
            )
          )
        )
      ) : React.createElement('div', { className: "flex justify-center items-center h-64" }, React.createElement('p', { className: "text-gray-500 dark:text-gray-400" }, "Loading..."))
    )
  );
}