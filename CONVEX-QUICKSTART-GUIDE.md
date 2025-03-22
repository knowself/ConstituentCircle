# Convex Quickstart Guide

This guide provides a comprehensive overview of integrating Convex into a Next.js project, with annotated code examples from our implementation.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Client Initialization](#client-initialization)
3. [Schema Definition](#schema-definition)
4. [Authentication](#authentication)
5. [Query and Mutation Patterns](#query-and-mutation-patterns)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Testing](#testing)
10. [Debugging ConvexClientProvider Issues](#debugging-convexclientprovider-issues)
11. [TypeScript Errors in Convex Functions](#typescript-errors-in-convex-functions)

## Initial Setup

### Installation

```bash
# Tested with:
# convex@1.10.0
# next@14.1.0
npm install convex
# or with specific version
npm install convex@1.10.0
# or
yarn add convex
```

### Environment Configuration

Create a `.env.local` file with your Convex URL:

```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Client Initialization

### Simple ConvexClientProvider

For smaller projects or quick prototyping, you can use this simplified version:

```tsx
// components/SimpleConvexProvider.tsx
'use client';

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Create a client instance
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function SimpleConvexProvider({ children }: { children: ReactNode }) {
  // This works for basic cases but doesn't handle SSR or initialization errors
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### Robust ConvexClientProvider Component

```tsx
// components/ConvexClientProvider.tsx
'use client';

import { ReactNode, useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Create a single global instance of the client to ensure it's only initialized once
let convexClient: ConvexReactClient | null = null;

// Helper function to get the Convex URL from available sources
function getConvexUrl(): string {
  // Try to get the URL from process.env first
  let url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
  
  // If not available, try window.ENV
  if (!url && typeof window !== 'undefined' && window.ENV && window.ENV.CONVEX_URL) {
    url = window.ENV.CONVEX_URL;
  }
  
  if (!url) {
    console.error('Convex URL not found in environment variables or window.ENV');
  } else {
    console.log('Using Convex URL:', url);
  }
  
  return url;
}

// Initialize the client outside of React components, but only on the client side
if (typeof window !== 'undefined') {
  // Delay initialization to ensure window.ENV is available
  setTimeout(() => {
    if (!convexClient) {
      const url = getConvexUrl();
      if (url) {
        console.log('Initializing global Convex client with URL:', url);
        try {
          convexClient = new ConvexReactClient(url);
          console.log('Global Convex client successfully initialized');
          
          // Make it available for debugging
          window.__CONVEX_STATE = window.__CONVEX_STATE || {};
          window.__CONVEX_STATE.client = convexClient;
          
          // Dispatch an event that other components can listen for
          window.dispatchEvent(new Event('convex:initialized'));
        } catch (error) {
          console.error('Failed to initialize global Convex client:', error);
        }
      }
    }
  }, 0);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [clientInitialized, setClientInitialized] = useState(!!convexClient);
  const [error, setError] = useState<string | null>(null);
  
  // For server-side rendering, return children without the provider
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  
  useEffect(() => {
    // Check if client is already initialized
    if (convexClient) {
      setClientInitialized(true);
      return;
    }
    
    // Listen for the initialization event
    const handleInitialized = () => {
      if (convexClient) {
        setClientInitialized(true);
      }
    };
    
    window.addEventListener('convex:initialized', handleInitialized);
    
    // If client is not initialized yet, try to initialize it
    if (!clientInitialized && !error) {
      const url = getConvexUrl();
      if (url) {
        try {
          console.log('Initializing Convex client inside component with URL:', url);
          convexClient = new ConvexReactClient(url);
          console.log('Convex client successfully initialized inside component');
          setClientInitialized(true);
          
          // Make it available for debugging
          window.__CONVEX_STATE = window.__CONVEX_STATE || {};
          window.__CONVEX_STATE.client = convexClient;
        } catch (err: any) {
          console.error('Error initializing Convex client:', err);
          setError(err.message || 'Failed to initialize Convex client');
        }
      } else {
        setError('Convex URL not found');
      }
    }
    
    return () => {
      window.removeEventListener('convex:initialized', handleInitialized);
    };
  }, [clientInitialized, error]);
  
  // If client is initialized, use it
  if (clientInitialized && convexClient) {
    return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
  }
  
  // If there's an error, show it
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h2 className="text-lg font-semibold">Convex Client Error</h2>
        <p>{error}</p>
        {children} {/* Still render children to allow fallback functionality */}
      </div>
    );
  }
  
  // Loading state
  return (
    <div className="flex items-center justify-center p-4">
      <p>Initializing Convex client...</p>
    </div>
  );
}
```

### Integration in App Layout

```tsx
// app/layout.tsx
'use client';

import { ConvexClientProvider } from "../components/ConvexClientProvider";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV = window.ENV || {};
              window.ENV.CONVEX_URL = "${process.env.NEXT_PUBLIC_CONVEX_URL || ''}";
            `
          }}
        />
      </head>
      <body>
        <ConvexClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### TypeScript Definitions

```typescript
// global.d.ts
declare global {
  interface Window {
    ENV?: {
      CONVEX_URL?: string;
      [key: string]: string | undefined;
    };
    
    // Add Convex internal state for debugging
    __CONVEX_STATE?: {
      client?: any;
      auth?: any;
      [key: string]: any;
    };
  }
}

export {};
```

## Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    authProvider: v.optional(v.string()),
    role: v.optional(v.string()),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      employmentType: v.optional(v.union(
        v.literal('permanent'),
        v.literal('seasonal'),
        v.literal('intern')
        // Add other employment types as needed
      ))
    })),
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
    displayname: v.optional(v.string())
  })
    // Indexes improve query performance by creating lookup tables
    .index("by_email", ["email"]) // Enables fast lookups by email
    .index("by_token", ["tokenIdentifier"]) // Enables fast lookups by token
    .index("by_role", ["role"]), // Enables fast filtering by role
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number())
  })
    // Index for fast session lookups by token
    .index("by_token", ["token"]),
  
  // Add other tables as needed
});
```

Indexes in Convex are used to improve query performance by creating lookup tables. They allow for fast lookups, filtering, and sorting of data. In the example above, we define three indexes on the `users` table: `by_email`, `by_token`, and `by_role`. These indexes enable fast lookups by email, token, and role, respectively.

## Authentication

### Auth Context

```tsx
// context/AuthContext.tsx (simplified)
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ConvexSafeComponent } from '../components/ConvexErrorBoundary';

// Define the user profile type for clarity
interface UserProfile {
  _id: string;
  email: string;
  displayname?: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  convexAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [convexAvailable, setConvexAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
      const token = localStorage.getItem('sessionToken');
      if (token) setSessionToken(token);
      else setLoading(false);

      // Check if Convex is available
      try {
        if (window.__CONVEX_STATE?.client) {
          setConvexAvailable(true);
        }
      } catch (e) {
        setConvexAvailable(false);
      }
    }
  }, []);

  // Only use Convex hooks if available and mounted
  let login, register, logoutMutation, currentUserResult;
  
  if (convexAvailable && mounted) {
    try {
      login = useMutation(api.auth.login);
      register = useMutation(api.auth.register);
      logoutMutation = useMutation(api.auth.logout);
      
      currentUserResult = useQuery(
        api.auth.getCurrentUser,
        mounted && sessionToken ? { token: sessionToken } : "skip"
      );
    } catch (e) {
      console.error('Error using Convex hooks:', e);
    }
  }

  // Implementation of auth methods...
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signIn: async (email, password) => { /* implementation */ },
      signUp: async (email, password, role) => { /* implementation */ },
      logout: async () => { /* implementation */ },
      convexAvailable
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexSafeComponent fallback={
      <div className="p-4 text-center">
        <p className="text-yellow-600 font-semibold">Convex Client Not Available</p>
        <p className="text-gray-600 mt-2">Using limited functionality mode.</p>
      </div>
    }>
      <AuthProviderContent>{children}</AuthProviderContent>
    </ConvexSafeComponent>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
```

### Convex Auth Functions

```typescript
// convex/auth.ts (simplified)
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";

// Login with email and password
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = args;
    const normalizedEmail = email.toLowerCase();
    
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    
    if (!user) {
      throw new ConvexError("Invalid email or password");
    }
    
    // Verify password
    const passwordValid = await ctx.runAction(internal.auth.verifyPassword, {
      password,
      hash: user.passwordHash || "",
    });
    
    if (!passwordValid) {
      throw new ConvexError("Invalid email or password");
    }
    
    // Generate session token
    const token = await ctx.runAction(internal.auth.generateToken, {});
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    
    // Create session
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });
    
    // Update last login time
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });
    
    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        displayname: user.displayname,
        role: user.role || "user",
        name: user.name,
      },
    };
  },
});

// Get current user
export const getCurrentUser = query({
  args: {
    token: v.union(v.string(), v.literal("skip")),
  },
  handler: async (ctx, args) => {
    if (args.token === "skip") {
      return null;
    }
    
    // Find session by token
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    if (!session) {
      return null;
    }
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return null;
    }
    
    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id,
      email: user.email,
      displayname: user.displayname,
      role: user.role || "user",
      name: user.name,
    };
  },
});
```

### Internal Auth Functions

```typescript
// convex/auth.internal.ts
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Internal action for password hashing
export const internal_hashPassword = internalAction({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(args.password, salt);
  },
});

// Internal action for password verification
export const internal_verifyPassword = internalAction({
  args: { password: v.string(), hash: v.string() },
  handler: async (ctx, args) => {
    return await bcrypt.compare(args.password, args.hash);
  },
});

// Internal action for token generation
export const internal_generateToken = internalAction({
  args: {},
  handler: async (ctx) => {
    return randomBytes(32).toString('hex');
  },
});
```

## Query and Mutation Patterns

### Basic Query

```typescript
// convex/users_queries.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
```

### Basic Mutation

```typescript
// convex/users_mutations.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    displayname: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Check if user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update user
    return await ctx.db.patch(userId, updates);
  },
});
```

### Action (Node.js Runtime)

```typescript
// convex/users_actions.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const createUserWithPassword = action({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, name, password, role } = args;
    
    // Hash password using internal action
    const passwordHash = await ctx.runAction(internal.auth.internal_hashPassword, {
      password,
    });
    
    // Create user using internal mutation
    const userId = await ctx.runMutation(internal.users.createUser, {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role,
      createdAt: Date.now(),
    });
    
    return userId;
  },
});
```

## Error Handling

### ConvexErrorBoundary Component

```tsx
// components/ConvexErrorBoundary.tsx
'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ConvexErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h2 className="text-lg font-semibold">Something went wrong with Convex</h2>
          <p className="mt-2">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ConvexSafeComponent({ 
  children, 
  fallback 
}: Props): ReactNode {
  return (
    <ConvexErrorBoundary fallback={fallback}>
      {children}
    </ConvexErrorBoundary>
  );
}
```

### Fallback API Route

```typescript
// app/api/login/route.ts
import { NextResponse } from 'next/server';

function getConvexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL || '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Get the Convex URL
    const convexUrl = getConvexUrl();
    if (!convexUrl) {
      return NextResponse.json(
        { message: 'Convex URL is not configured' },
        { status: 500 }
      );
    }
    
    // Make a direct fetch to the Convex API
    const response = await fetch(`${convexUrl}/api/action/auth:loginWithEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        args: { email, password },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Login failed' },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

## Best Practices

### 1. Client Initialization

- Initialize the Convex client outside of React components to ensure it's only created once
- Add a delay with setTimeout to ensure window.ENV is available
- Use both process.env and window.ENV for accessing the Convex URL
- Implement proper error handling for client initialization failures

### 2. Error Handling

- Use error boundaries to catch errors from Convex hooks
- Implement fallback mechanisms for when Convex is not available
- Add comprehensive logging for debugging

### 3. Authentication

- Store session tokens in localStorage
- Implement proper session expiration
- Use bcrypt for password hashing
- Use internal actions for sensitive operations

### 4. Data Fetching

- Use the "skip" pattern for conditional queries
- Properly handle loading and error states
- Use indexes for efficient queries

### 5. TypeScript

- Define proper return types for all functions
- Use validators for all function arguments
- Add type definitions for global objects

### 6. Reactivity and Caching

- Leverage Convex's built-in reactivity instead of manual caching
- Convex queries automatically update when data changes
- Avoid implementing your own caching layer for Convex data
- Let Convex handle the real-time updates through its subscription system

## Troubleshooting

### Common Errors

#### "Could not find Convex client!"

This error occurs when a component tries to use Convex hooks but is not properly wrapped by a ConvexProvider, or the Convex client initialization has failed.

**Solution:**
1. Ensure `ConvexClientProvider` is properly set up at the root of your application.
2. Check that the Convex URL is correctly specified in your environment variables.
3. Verify that the Convex client is initialized only on the client side using the `'use client'` directive.
4. Check the Convex Dashboard for deployment logs and schema status.

#### React Hook Dependency Errors

Errors like `TypeError: prevDeps is undefined` or `TypeError: undefined has no properties` in React hooks when using Convex:

```
ConvexErrorBoundary caught an error: TypeError: prevDeps is undefined
    areHookInputsEqual webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:5028
    updateEffectImpl webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:6059
    useEffect webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:23167
```

Or:

```
Error using Convex hooks: TypeError: undefined has no properties
    areHookInputsEqual webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:5028
    updateMemo webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:6169
    useMemo webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:23190
```

**Solution:**

Fix your implementation with these changes:

1. **Properly initialize dependency arrays**: Always provide an empty array `[]` or proper dependencies to all React hooks.

   ```tsx
   // INCORRECT - missing dependency array
   useEffect(() => {
     // Effect code
   });
   
   // CORRECT - with empty dependency array
   useEffect(() => {
     // Effect code that runs once
   }, []);
   
   // CORRECT - with proper dependencies
   useEffect(() => {
     // Effect code that runs when dependencies change
   }, [dep1, dep2]);
   ```

2. **Handle conditional hooks properly**: Never use Convex hooks conditionally.

   ```tsx
   // INCORRECT - conditional hook usage
   function Component() {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     
     // This will cause errors
     if (isLoggedIn) {
       const userData = useQuery(api.users.getUser, { userId });
     }
     
     return <div>...</div>;
   }
   
   // CORRECT - always call hooks at the top level
   function Component() {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     
     // Always call the hook, handle the condition in the query
     const userData = useQuery(
       api.users.getUser, 
       isLoggedIn ? { userId } : "skip"
     );
     
     return <div>...</div>;
   }
   ```

3. **Use ConvexErrorBoundary**: Wrap components using Convex hooks with error boundaries.

   ```tsx
   import { ConvexSafeComponent } from '../components/ConvexErrorBoundary';
   
   export function UserProfile({ userId }) {
     return (
       <ConvexSafeComponent
         fallback={<div>Error loading user data</div>}
       >
         <UserProfileContent userId={userId} />
       </ConvexSafeComponent>
     );
   }
   
   function UserProfileContent({ userId }) {
     // Convex hooks here
     const user = useQuery(api.users.getUser, { userId });
     return <div>{user?.name}</div>;
   }
   ```

4. **Stable function references**: Use `useCallback` for functions in dependency arrays.

   ```tsx
   // Use useCallback for functions that are dependencies of hooks
   const handleUserUpdate = useCallback((data) => {
     updateUser({ id: userId, ...data });
   }, [userId, updateUser]);
   
   // Now it's safe to use in a dependency array
   useEffect(() => {
     // Effect code
   }, [handleUserUpdate]);
   ```

### Specific Component Fixes

#### AuthContext Hook Errors

A common issue occurs in the AuthContext component with errors like:

```
ConvexErrorBoundary caught an error: TypeError: prevDeps is undefined
    areHookInputsEqual webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:5028
    updateEffectImpl webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:6059
    useEffect webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:23167
```

Or:

```
Error using Convex hooks: TypeError: undefined has no properties
    areHookInputsEqual webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:5028
    updateMemo webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:6169
    useMemo webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:23190
```

**Solution:**

Fix your AuthContext implementation with these changes:

```tsx
// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ConvexSafeComponent } from '@/components/ConvexErrorBoundary';

// AuthContext implementation
export function AuthProvider({ children }) {
  return (
    <ConvexSafeComponent fallback={<div>Authentication service unavailable</div>}>
      <AuthProviderContent>
        {children}
      </AuthProviderContent>
    </ConvexSafeComponent>
  );
}

function AuthProviderContent({ children }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Get token from localStorage on mount only
  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // Empty dependency array is crucial
  
  // Stable reference to the getCurrentUser query
  const getCurrentUser = useCallback((token) => {
    if (!token) return null;
    return api.auth.getCurrentUser;
  }, []);
  
  // Use the token to get the current user
  const userData = useQuery(
    getCurrentUser(token),
    token ? { token } : "skip"
  );
  
  // Update user state when userData changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]); // Only depend on userData
  
  // Stable logout function
  const logout = useCallback(async () => {
    if (token) {
      try {
        // Call logout mutation with proper dependency
        await logoutMutation({ token });
      } catch (error) {
        console.error('Logout error:', error);
      }
      // Clear local state
      localStorage.removeItem('sessionToken');
      setToken(null);
      setUser(null);
    }
  }, [token]); // Only depend on token
  
  // Get a stable reference to the logout mutation
  const logoutMutation = useMutation(api.auth.logout);
  
  // Rest of your AuthContext implementation...
}
```

Key fixes:
1. Wrap with `ConvexSafeComponent` to catch errors
2. Use proper dependency arrays in all hooks
3. Use `useCallback` for functions that are used in dependency arrays
4. Implement the "skip" pattern for conditional queries
5. Separate the component that uses Convex hooks into its own component

### Best Practices for Avoiding Hook Errors

1. **Stable API References**: Always import Convex API from the generated file and use it consistently.
2. **Dependency Management**: Be explicit about dependencies in all React hooks.
3. **Error Boundaries**: Use error boundaries around components with Convex hooks.
4. **Skip Pattern**: Implement the "skip" pattern for conditional queries.
5. **Memoization**: Use `useMemo` and `useCallback` to stabilize references.

## Debugging ConvexClientProvider Issues

If you're experiencing errors with the ConvexClientProvider component, such as:

```
Environment variables loaded: 
Object { CONVEX_URL: "https://tangible-butterfly-498.convex.cloud", ENV: "dev" }
env-config.js:7:9
```

Followed by React hook errors, this indicates that the Convex client is initializing but React hooks are failing.

**Solution:**

Implement a robust ConvexClientProvider that handles client-side initialization properly:

```tsx
// components/ConvexClientProvider.tsx
'use client';

import { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Loading } from '@/components/Loading';

// Create a single global instance of the client to avoid duplicates
let convexClient: ConvexReactClient | null = null;

function getConvexUrl(): string {
  // Try to get URL from both process.env and window.ENV
  if (typeof window !== 'undefined' && window.ENV?.CONVEX_URL) {
    return window.ENV.CONVEX_URL;
  }
  return process.env.NEXT_PUBLIC_CONVEX_URL || '';
}

// Initialize the client only on the client side
function initializeClient() {
  if (convexClient) return convexClient;
  
  try {
    const url = getConvexUrl();
    if (!url) {
      console.error('Convex URL is not defined');
      return null;
    }
    
    convexClient = new ConvexReactClient(url);
    
    // For debugging
    if (typeof window !== 'undefined') {
      window.__CONVEX_STATE = { client: convexClient, url };
    }
    
    return convexClient;
  } catch (error) {
    console.error('Failed to initialize Convex client:', error);
    return null;
  }
}

export function ConvexClientProvider({ children }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize client on mount
    try {
      const initializedClient = initializeClient();
      setClient(initializedClient);
      if (!initializedClient) {
        setError('Failed to initialize Convex client');
      }
    } catch (err: any) {
      console.error('Error initializing Convex client:', err);
      setError(err.message || 'Unknown error initializing Convex client');
    } finally {
      setLoading(false);
    }
    
    // No cleanup needed as we're using a global client
  }, []); // Empty dependency array is crucial
  
  if (loading) {
    return <Loading message="Initializing Convex client..." />;
  }
  
  if (error || !client) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-bold">Convex Client Error</h3>
        <p>{error || 'Failed to initialize Convex client'}</p>
        <p className="text-sm mt-2">
          Check your NEXT_PUBLIC_CONVEX_URL environment variable and network connection.
        </p>
      </div>
    );
  }
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
```

Add this type definition to your `global.d.ts` file:

```typescript
// global.d.ts
interface Window {
  ENV?: {
    CONVEX_URL?: string;
    [key: string]: any;
  };
  __CONVEX_STATE?: {
    client: any;
    url: string;
  };
}
```

Key improvements:
1. Global client instance to prevent multiple initializations
2. Proper error handling and fallback UI
3. Support for both process.env and window.ENV
4. Debug information on window.__CONVEX_STATE
5. Proper loading state

## Testing

Testing Convex functions is essential for building reliable applications. Convex provides built-in testing utilities to help you write unit tests for your functions.

### Running Tests

```bash
# Run all tests
npx convex test

# Run tests in a specific file
npx convex test convex/tests/users.test.ts
```

### Example Test

```typescript
// convex/tests/users.test.ts
import { test } from "../testing";
import { api } from "../_generated/api";

test("users can be created and queried", async (ctx) => {
  // Create a test user
  const userId = await ctx.runMutation(api.users.createUser, {
    email: "test@example.com",
    name: "Test User",
    role: "user",
  });
  
  // Query the user
  const user = await ctx.runQuery(api.users.getUser, { userId });
  
  // Assert the user exists
  ctx.assert(user !== null, "User should exist");
  ctx.assert(user.email === "test@example.com", "Email should match");
});
```

### Mocking External Services

For tests that involve external services, you can use mocks:

```typescript
// convex/tests/auth.test.ts
import { test } from "../testing";
import { api, internal } from "../_generated/api";

test("login validates passwords", async (ctx) => {
  // Mock the password verification
  ctx.mockAction(internal.auth.verifyPassword, async ({ password, hash }) => {
    return password === "correct-password";
  });
  
  // Create a test user
  const userId = await ctx.runMutation(api.users.createUser, {
    email: "test@example.com",
    name: "Test User",
    passwordHash: "hashed-password",
    role: "user",
  });
  
  // Test successful login
  const result = await ctx.runMutation(api.auth.login, {
    email: "test@example.com",
    password: "correct-password",
  });
  
  ctx.assert(result.user.email === "test@example.com", "Login should return user data");
});
```

## TypeScript Errors in Convex Functions

When working with Convex and TypeScript, you may encounter various type errors. Here are common issues and their solutions:

### Node.js Runtime vs. Convex Runtime

One of the most common errors occurs when mixing Node.js runtime functions with Convex runtime functions:

```
Error: File with "use node"; directive cannot export query or mutation functions
```

**Solution:**

1. Files with `"use node";` must only contain `action` functions, not `query` or `mutation` functions
2. Convert all queries/mutations in Node.js runtime files to actions that use `ctx.runQuery()` and `ctx.runMutation()`

```typescript
// INCORRECT - This will cause an error
"use node";
import { query, mutation } from "./_generated/server";

export const myQuery = query({ ... }); // Error!

// CORRECT - Only actions in Node.js runtime files
"use node";
import { action } from "./_generated/server";

export const myAction = action({
  handler: async (ctx) => {
    // Use ctx.runQuery instead of direct query
    const result = await ctx.runQuery(api.myModule.someQuery);
    // Use ctx.runMutation instead of direct mutation
    await ctx.runMutation(api.myModule.someMutation, { data: result });
  }
});
```

### Return Type Mismatches

Another common error is when the function's return value doesn't match the declared return type:

```
Type 'null' is not assignable to type '{ user: { name: string; email: string; } }'
```

**Solution:**

1. Always define precise return types using the `returns` field
2. Ensure your function returns exactly match the structure defined
3. Transform database objects to match the expected return type

```typescript
// INCORRECT - Return type mismatch
export const getUser = query({
  args: { id: v.string() },
  returns: v.object({
    user: v.object({
      name: v.string(),
      email: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user; // Error! This doesn't match the return type
  },
});

// CORRECT - Transform to match return type
export const getUser = query({
  args: { id: v.string() },
  returns: v.object({
    user: v.object({
      name: v.string(),
      email: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null; // Handle null case properly
    
    // Transform to match return type
    return {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  },
});
```

### Inline Functions in Node.js Actions

Using inline anonymous functions with `ctx.runQuery` or `ctx.runMutation` can cause type errors:

```
Argument of type '(args: {}) => Promise<...>' is not assignable to parameter of type 'FunctionReference<...>'
```

**Solution:**

Never use inline anonymous functions with `ctx.runQuery` or `ctx.runMutation`. Instead, import and use proper function references:

```typescript
// INCORRECT - Using inline function
"use node";
import { action } from "./_generated/server";

export const myAction = action({
  handler: async (ctx) => {
    // This will cause a type error
    const result = await ctx.runQuery(async () => {
      return { data: "some data" };
    });
  }
});

// CORRECT - Using function reference
"use node";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const myAction = action({
  handler: async (ctx) => {
    // This works correctly
    const result = await ctx.runQuery(api.myModule.someQuery);
  }
});
```

### Circular References in API Imports

Circular references can occur when importing functions using the `api` object:

```
Error: Circular dependency detected in module graph
```

**Solution:**

Use `internal` instead of `api` when importing functions to avoid circular references:

```typescript
// INCORRECT - Can cause circular references
import { api } from "./_generated/api";

// CORRECT - Use internal to avoid circular references
import { internal } from "./_generated/api";
```

### Debugging Tips

1. Use `--typecheck=disable` to temporarily bypass TypeScript errors during development:
   ```bash
   npx convex dev --typecheck=disable
   ```

2. Run Convex in verbose mode to see detailed error messages:
   ```bash
   npx convex dev -v
   ```

3. Check which runtime your file is using in the Convex server output

4. Use the Convex dashboard to see detailed error logs
