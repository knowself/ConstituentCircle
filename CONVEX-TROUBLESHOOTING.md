# Convex Troubleshooting Guide

## Common Issues and Solutions

### 1. "Could not find Convex client" Error

**Error Message:**
```
Error: Could not find Convex client! `useMutation` must be used in the React component tree under `ConvexProvider`. Did you forget it? See https://docs.convex.dev/quick-start#set-up-convex-in-your-react-app
```

**Cause:**
This error occurs when a component tries to use Convex hooks (`useMutation`, `useQuery`, etc.) but is not properly wrapped by a `ConvexProvider` component, or the Convex client initialization has failed.

**Solutions:**

1. **Ensure ConvexClientProvider is properly implemented:**
   ```tsx
   // components/ConvexClientProvider.tsx
   'use client';
   
   import { ReactNode, useState, useEffect } from "react";
   import { ConvexProvider, ConvexReactClient } from "convex/react";
   
   // Create a single instance of the Convex client
   let convexClient: ConvexReactClient | null = null;
   
   // Initialize the client outside of React component - but only on client side
   if (typeof window !== 'undefined') {
     // Delay initialization to ensure window.ENV is available
     setTimeout(() => {
       if (!convexClient) {
         try {
           // Try to get the URL from process.env first
           let url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
           
           // If not available, try window.ENV
           if (!url && window.ENV && window.ENV.CONVEX_URL) {
             url = window.ENV.CONVEX_URL;
           }
           
           if (url) {
             console.log('Initializing Convex client with URL:', url);
             convexClient = new ConvexReactClient(url);
             console.log('Convex client successfully initialized outside of React component');
             
             // Force a re-render of any components that might be waiting for the client
             window.dispatchEvent(new Event('convex:initialized'));
           } else {
             console.error('No Convex URL found');
           }
         } catch (error) {
           console.error('Failed to initialize Convex client outside of React component:', error);
         }
       }
     }, 0);
   }
   
   export function ConvexClientProvider({ children }: { children: ReactNode }) {
     const [isInitialized, setIsInitialized] = useState(false);
     const [error, setError] = useState<string | null>(null);
     
     // For server-side rendering, return children without the provider
     if (typeof window === 'undefined') {
       return <>{children}</>;
     }
     
     useEffect(() => {
       // Initialize the client if it hasn't been initialized yet
       if (!convexClient) {
         try {
           // Try to get the URL from process.env first
           let url = process.env.NEXT_PUBLIC_CONVEX_URL || '';
           
           // If not available, try window.ENV
           if (!url && window.ENV && window.ENV.CONVEX_URL) {
             url = window.ENV.CONVEX_URL;
           }
           
           console.log('Initializing Convex client with URL:', url);
           
           if (url) {
             convexClient = new ConvexReactClient(url);
             console.log('Convex client successfully initialized inside React component');
             setIsInitialized(true);
           } else {
             setError('No Convex URL found');
             console.error('No Convex URL found');
           }
         } catch (error) {
           setError(error instanceof Error ? error.message : 'Unknown error');
           console.error('Failed to initialize Convex client inside React component:', error);
         }
       } else {
         // Client already exists
         setIsInitialized(true);
       }
       
       // Listen for the initialization event
       const handleInitialized = () => {
         if (convexClient) {
           setIsInitialized(true);
         }
       };
       
       window.addEventListener('convex:initialized', handleInitialized);
       
       return () => {
         window.removeEventListener('convex:initialized', handleInitialized);
       };
     }, []);
     
     // If client is not initialized yet and there's no error
     if (!isInitialized && !error) {
       return (
         <div className="p-4 text-center">
           <p className="text-gray-600">Initializing Convex client...</p>
         </div>
       );
     }
     
     // If there was an error initializing the client
     if (error) {
       return (
         <div className="p-4 text-center">
           <p className="text-red-600 font-semibold">Failed to initialize Convex client</p>
           <p className="text-gray-600 mt-2">{error}</p>
           {children}
         </div>
       );
     }
     
     // Client is initialized, use the provider
     return (
       <ConvexProvider client={convexClient!}>
         {children}
       </ConvexProvider>
     );
   }
   ```

2. **Ensure Environment Variables are Properly Set:**
   - Check that `NEXT_PUBLIC_CONVEX_URL` is set in your `.env.local` file
   - Create a custom `_document.tsx` to inject environment variables into `window.ENV`:
   ```tsx
   // pages/_document.tsx
   import { Html, Head, Main, NextScript } from 'next/document';
   import Document from 'next/document';
   
   class MyDocument extends Document {
     render() {
       return (
         <Html lang="en">
           <Head />
           <body>
             <Main />
             <script
               dangerouslySetInnerHTML={{
                 __html: `
                   window.ENV = window.ENV || {};
                   window.ENV.CONVEX_URL = "${process.env.NEXT_PUBLIC_CONVEX_URL || ''}";
                   window.ENV.ENV = "${process.env.NEXT_PUBLIC_ENV || 'dev'}";
                 `,
               }}
             />
             <NextScript />
           </body>
         </Html>
       );
     }
   }
   
   export default MyDocument;
   ```

3. **Add TypeScript Type Definitions for window.ENV:**
   ```typescript
   // types/global.d.ts
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
   ```

4. **Create a Debug Component to Check Convex Status:**
   ```tsx
   // components/ConvexDebug.tsx
   'use client';
   
   import { useState, useEffect } from 'react';
   
   export default function ConvexDebug() {
     const [debugInfo, setDebugInfo] = useState<any>(null);
     
     // For server-side rendering, return a placeholder
     if (typeof window === 'undefined') {
       return <div className="p-4 border rounded bg-gray-50 text-sm">Loading debug info...</div>;
     }
     
     useEffect(() => {
       try {
         // @ts-ignore - accessing internal Convex state for debugging
         const convexState = window.__CONVEX_STATE;
         
         setDebugInfo({
           timestamp: new Date().toISOString(),
           hasConvexState: !!convexState,
           hasClient: !!(convexState?.client),
           hasAuth: !!(convexState?.auth),
           envVars: {
             NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
             windowENV: window.ENV
           }
         });
       } catch (e) {
         setDebugInfo({
           error: String(e),
           timestamp: new Date().toISOString()
         });
       }
     }, []);
     
     if (!debugInfo) {
       return <div className="p-4 border rounded bg-gray-50 text-sm">Loading debug info...</div>;
     }
     
     return (
       <div className="p-4 border rounded bg-gray-50 text-sm">
         <h3 className="font-medium mb-2">Convex Debug Info</h3>
         <pre className="whitespace-pre-wrap overflow-auto max-h-40">
           {JSON.stringify(debugInfo, null, 2)}
         </pre>
       </div>
     );
   }
   ```

5. **Handle Hydration Mismatches:**
   - Ensure server and client render the same content initially
   - Use `suppressHydrationWarning` on the html element
   - Move client-specific code inside useEffect hooks

### 2. TypeScript Errors in Convex Functions

#### Node.js Runtime vs. Convex Runtime

**Issue:** Files with `"use node";` must only contain `action` functions, not `query` or `mutation` functions.

**Solution:** Convert all queries/mutations in Node.js runtime files to actions that use `ctx.runQuery()` and `ctx.runMutation()`.

```typescript
// Before (error)
"use node";
import { query } from "./_generated/server";

export const getUser = query({
  // ...
});

// After (fixed)
"use node";
import { action } from "./_generated/server";

export const getUser = action({
  // ...
  handler: async (ctx, args) => {
    return await ctx.runQuery(internal.users.getUserById, { id: args.id });
  }
});
```

#### Return Type Mismatches

**Issue:** Function returns must exactly match the structure defined in the `returns` field.

**Solution:** Always transform database objects to match the expected return type structure.

```typescript
// Before (error)
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.object({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user; // Error: user structure doesn't match return type
  },
});

// After (fixed)
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.object({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return {
      userId: user._id.toString(),
      name: user.name || "",
      email: user.email,
      role: user.role,
    };
  },
});
```

#### Inline Functions in Node.js Actions

**Issue:** Never use inline anonymous functions with `ctx.runQuery` or `ctx.runMutation`.

**Solution:** Import and use proper function references instead.

```typescript
// Before (error)
"use node";
import { action } from "./_generated/server";

export const updateUser = action({
  // ...
  handler: async (ctx, args) => {
    return await ctx.runMutation(async (ctx) => { // Error: inline function
      return await ctx.db.patch(args.userId, args.data);
    });
  },
});

// After (fixed)
"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const updateUser = action({
  // ...
  handler: async (ctx, args) => {
    return await ctx.runMutation(internal.users.updateUserData, {
      userId: args.userId,
      data: args.data
    });
  },
});
```

#### Circular References in API Imports

**Issue:** Using `api` imports can cause circular references.

**Solution:** Use `internal` instead of `api` when importing functions to avoid circular references.

```typescript
// Before (potential circular reference)
import { api } from "./_generated/api";

// After (fixed)
import { internal } from "./_generated/api";
```

## Debugging Tips

- Use `--typecheck=disable` to temporarily bypass TypeScript errors during development
- Run Convex in verbose mode with `npx convex dev -v` to see detailed error messages
- Check which runtime your file is using in the Convex server output
- Use the `/convex-test` page to diagnose client-side issues

## Common Patterns

- **Node.js Runtime Files:** Always use actions with `ctx.runQuery` and `ctx.runMutation`
- **Convex Runtime Files:** Use standard queries and mutations
- **Return Types:** Always define and match return types precisely
- **Imports:** Use `internal` instead of `api` to avoid circular references
- **Client Initialization:** Initialize the Convex client once outside of React components
