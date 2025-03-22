# Convex Code Patterns

This document provides annotated code examples for common Convex patterns to help you quickly integrate Convex into your Next.js projects.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Authentication Patterns](#authentication-patterns)
3. [Data Access Patterns](#data-access-patterns)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Integration Patterns](#integration-patterns)
6. [Blockchain Integration Patterns](#blockchain-integration-patterns)

## Schema Definition

### Basic Schema with Indexes

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table with indexes for email, token, and role
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    role: v.optional(v.string(), "user"), // Default to "user" role
    createdAt: v.optional(v.number(), () => Date.now()), // Default to current timestamp
    lastLoginAt: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_email", ["email"]) // Create index for email lookups
    .index("by_token", ["tokenIdentifier"]) // Create index for token lookups
    .index("by_role", ["role"]), // Create index for role-based queries
  
  // Sessions table with token index
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number(), () => Date.now()), // Default to current timestamp
  }).index("by_token", ["token"]), // Create index for token lookups
});
```

### Advanced Schema with Validators

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define custom validators for reuse
const employmentTypes = v.union(
  v.literal('permanent'),
  v.literal('seasonal'),
  v.literal('intern'),
  v.literal('elected'),
  v.literal('volunteer')
);

const governmentLevels = v.union(
  v.literal('federal'),
  v.literal('state'),
  v.literal('county'),
  v.literal('municipal'),
  v.literal('other')
);

export default defineSchema({
  profiles: defineTable({
    email: v.string(),
    displayname: v.string(),
    governmentLevel: governmentLevels,
    jurisdiction: v.string(),
    district: v.optional(v.string()),
    party: v.optional(v.string()),
    position: v.optional(v.string()),
    termStart: v.optional(v.number()),
    termEnd: v.optional(v.number()),
    role: v.optional(v.string()),
    metadata: v.object({
      firstName: v.string(),
      lastName: v.string(),
      employmentType: v.optional(employmentTypes)
    }),
    createdAt: v.number(),
    userId: v.optional(v.id('users'))
  })
    .index('by_email', ['email'])
    .index('by_role', ['role'])
    .index('by_user', ['userId']),
});
```

## Authentication Patterns

### Login Function

```typescript
// convex/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";

// Define return type for clarity
type AuthResponse = {
  token: string;
  user: {
    _id: Id<"users">;
    email: string;
    displayname?: string;
    role: string;
    name: string;
  };
};

// Login with email and password
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  // Explicitly define the return type
  returns: v.object({
    token: v.string(),
    user: v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const { email, password } = args;
    const normalizedEmail = email.toLowerCase();
    
    // Find user by email using index
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    
    if (!user) {
      throw new ConvexError("Invalid email or password");
    }
    
    // Verify password using internal action
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
    
    // Return user data and token
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
```

### Password Hashing with Node.js Runtime

```typescript
// convex/auth.internal.ts
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// Internal action for password hashing
export const internal_hashPassword = internalAction({
  args: { password: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(args.password, salt);
  },
});

// Internal action for password verification
export const internal_verifyPassword = internalAction({
  args: { password: v.string(), hash: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    return await bcrypt.compare(args.password, args.hash);
  },
});
```

### Get Current User with Session Token

```typescript
// convex/auth.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Get the currently authenticated user
export const getCurrentUser = query({
  args: {
    // Use union to allow skipping the query when token is not available
    token: v.union(v.string(), v.literal("skip")),
  },
  handler: async (ctx, args) => {
    // Skip the query if token is not provided
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

### Logout Function

```typescript
// convex/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Logout by invalidating the session token
export const logout = mutation({
  args: {
    token: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    // Find session by token
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    // If session exists, delete it
    if (session) {
      await ctx.db.delete(session._id);
    }
    
    return { success: true };
  },
});
```

## Data Access Patterns

### Basic Query with Pagination

```typescript
// convex/users.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    // Create a paginated query
    const results = await ctx.db
      .query("users")
      .order("desc")
      .paginate({ numItems: limit, cursor: args.cursor || null });
    
    return {
      users: results.page,
      nextCursor: results.isDone ? null : results.continueCursor,
    };
  },
});
```

### Query with Filtering and Sorting

```typescript
// convex/profiles.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchProfiles = query({
  args: {
    governmentLevel: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    role: v.optional(v.string()),
    searchTerm: v.optional(v.string()),
    sortBy: v.optional(v.union(v.literal("name"), v.literal("createdAt"))),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("profiles");
    
    // Apply filters
    if (args.governmentLevel) {
      query = query.filter((q) => q.eq(q.field("governmentLevel"), args.governmentLevel));
    }
    
    if (args.jurisdiction) {
      query = query.filter((q) => q.eq(q.field("jurisdiction"), args.jurisdiction));
    }
    
    if (args.role) {
      // Use index for role-based filtering
      query = query.withIndex("by_role", (q) => q.eq("role", args.role));
    }
    
    if (args.searchTerm) {
      const searchTerm = args.searchTerm.toLowerCase();
      query = query.filter((q) => 
        q.or(
          q.contains(q.field("displayname").lower(), searchTerm),
          q.contains(q.field("email").lower(), searchTerm)
        )
      );
    }
    
    // Apply sorting
    const sortBy = args.sortBy || "createdAt";
    const sortOrder = args.sortOrder || "desc";
    query = query.order(sortOrder, sortBy);
    
    // Apply limit
    const limit = args.limit || 20;
    query = query.take(limit);
    
    return await query.collect();
  },
});
```

### Transaction with Multiple Operations

```typescript
// convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUserWithProfile = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    governmentLevel: v.string(),
    jurisdiction: v.string(),
    metadata: v.object({
      firstName: v.string(),
      lastName: v.string(),
      employmentType: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { email, name, passwordHash, role, governmentLevel, jurisdiction, metadata } = args;
    const normalizedEmail = email.toLowerCase();
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    
    if (existingUser) {
      throw new Error("Email already registered");
    }
    
    // Create user
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      name,
      passwordHash,
      role,
      createdAt: Date.now(),
    });
    
    // Create profile
    const profileId = await ctx.db.insert("profiles", {
      email: normalizedEmail,
      displayname: name,
      governmentLevel,
      jurisdiction,
      role,
      metadata,
      createdAt: Date.now(),
      userId,
    });
    
    return { userId, profileId };
  },
});
```

## Error Handling Patterns

### Try-Catch Pattern in React Component

```tsx
// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Try to use Convex action if available
  const convexLogin = useAction(api.auth.login);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // First try using Convex action
      try {
        const result = await convexLogin({ email, password });
        // Store token in localStorage
        localStorage.setItem('sessionToken', result.token);
        // Redirect or update state
        return;
      } catch (convexError: any) {
        console.log('Convex login failed, falling back to API route:', convexError);
        // Fall back to fetch API if Convex action fails
      }
      
      // Fallback: Use fetch to call the API route
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('sessionToken', data.token);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="text-red-500">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
```

### Conditional Hooks with Error Boundary

```tsx
// components/UserProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ConvexSafeComponent } from './ConvexErrorBoundary';

function UserProfileContent({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { userId });
  
  if (user === undefined) {
    return <div>Loading user...</div>;
  }
  
  if (user === null) {
    return <div>User not found</div>;
  }
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {/* Other user details */}
    </div>
  );
}

export function UserProfile({ userId }: { userId: string }) {
  return (
    <ConvexSafeComponent
      fallback={
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <p>Could not load user profile. Please try again later.</p>
        </div>
      }
    >
      <UserProfileContent userId={userId} />
    </ConvexSafeComponent>
  );
}
```

## Integration Patterns

### Next.js API Route Fallback

```typescript
// app/api/login/route.ts
import { NextResponse } from 'next/server';

// Define request type for better type safety
interface LoginRequest {
  email: string;
  password: string;
}

function getConvexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL || '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as LoginRequest;
    const { email, password } = body;
    
    // Make a direct fetch to the Convex API
    const convexUrl = getConvexUrl();
    const response = await fetch(`${convexUrl}/api/action/auth:login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        args: { email, password },
      }),
    });
    
    // Forward the response
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### Convex Hooks in React Context

```tsx
// context/DataContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ConvexSafeComponent } from '../components/ConvexErrorBoundary';

interface DataContextType {
  users: any[] | null;
  loading: boolean;
  error: string | null;
  createUser: (userData: any) => Promise<void>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function DataProviderContent({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  
  // Convex hooks
  const users = useQuery(api.users.listUsers) || null;
  const createUserMutation = useMutation(api.users.createUser);
  const updateUserMutation = useMutation(api.users.updateUser);
  const deleteUserMutation = useMutation(api.users.deleteUser);
  
  // Wrap mutations with error handling
  const createUser = async (userData: any) => {
    setError(null); // Reset error state before operation
    try {
      await createUserMutation(userData);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    }
  };
  
  const updateUser = async (userId: string, userData: any) => {
    setError(null); // Reset error state before operation
    try {
      await updateUserMutation({ userId, ...userData });
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      throw err;
    }
  };
  
  const deleteUser = async (userId: string) => {
    setError(null); // Reset error state before operation
    try {
      await deleteUserMutation({ userId });
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      throw err;
    }
  };
  
  return (
    <DataContext.Provider
      value={{
        users,
        loading: users === undefined,
        error,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexSafeComponent
      fallback={
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
          <p>Data service is currently unavailable.</p>
        </div>
      }
    >
      <DataProviderContent>{children}</DataProviderContent>
    </ConvexSafeComponent>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

## Blockchain Integration Patterns

### PulseChain Token Balance Query

```typescript
// convex/blockchain/tokens.ts
import { action, query } from "../_generated/server";
import { v } from "convex/values";
import { ethers } from "ethers";

// Define a standard ERC20 ABI for token interactions
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Node.js action to fetch token balance from PulseChain
export const getTokenBalance = action({
  args: {
    walletAddress: v.string(),
    tokenAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const { walletAddress, tokenAddress } = args;
    
    // Connect to PulseChain RPC endpoint
    const provider = new ethers.JsonRpcProvider("https://rpc.pulsechain.com");
    
    // Create a contract instance for the token
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    
    try {
      // Get token details
      const [balance, decimals, symbol, name] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
        tokenContract.symbol(),
        tokenContract.name(),
      ]);
      
      // Convert balance to a human-readable format
      const formattedBalance = ethers.formatUnits(balance, decimals);
      
      // Store the result in Convex for caching
      const tokenBalanceId = await ctx.runMutation(internal.blockchain.storeTokenBalance, {
        walletAddress,
        tokenAddress,
        balance: formattedBalance,
        symbol,
        name,
        updatedAt: Date.now(),
      });
      
      return {
        balance: formattedBalance,
        symbol,
        name,
        tokenBalanceId,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch token balance: ${error.message}`);
    }
  },
});

// Query to get cached token balance
export const getCachedTokenBalance = query({
  args: {
    walletAddress: v.string(),
    tokenAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const { walletAddress, tokenAddress } = args;
    
    // Get the cached token balance
    const cachedBalance = await ctx.db
      .query("tokenBalances")
      .filter((q) => 
        q.and(
          q.eq(q.field("walletAddress"), walletAddress),
          q.eq(q.field("tokenAddress"), tokenAddress)
        )
      )
      .order("desc", "updatedAt")
      .first();
    
    if (!cachedBalance) {
      return null;
    }
    
    // Check if the cache is stale (older than 5 minutes)
    const isCacheStale = Date.now() - cachedBalance.updatedAt > 5 * 60 * 1000;
    
    return {
      balance: cachedBalance.balance,
      symbol: cachedBalance.symbol,
      name: cachedBalance.name,
      isStale: isCacheStale,
      updatedAt: cachedBalance.updatedAt,
    };
  },
});
```

### React Component for PulseChain Integration

```tsx
// components/TokenBalance.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ConvexSafeComponent } from './ConvexErrorBoundary';

interface TokenBalanceProps {
  walletAddress: string;
  tokenAddress: string;
}

function TokenBalanceContent({ walletAddress, tokenAddress }: TokenBalanceProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get cached balance from Convex
  const cachedBalance = useQuery(api.blockchain.tokens.getCachedTokenBalance, {
    walletAddress,
    tokenAddress,
  });
  
  // Action to fetch fresh balance
  const fetchBalance = useAction(api.blockchain.tokens.getTokenBalance);
  
  // Fetch fresh balance if cache is stale or missing
  useEffect(() => {
    const updateBalance = async () => {
      if (!cachedBalance || cachedBalance.isStale) {
        setLoading(true);
        setError(null);
        try {
          await fetchBalance({ walletAddress, tokenAddress });
        } catch (err: any) {
          setError(err.message || 'Failed to fetch token balance');
        } finally {
          setLoading(false);
        }
      }
    };
    
    updateBalance();
  }, [cachedBalance, fetchBalance, walletAddress, tokenAddress]);
  
  if (loading && !cachedBalance) {
    return <div>Loading token balance...</div>;
  }
  
  if (error && !cachedBalance) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  if (!cachedBalance) {
    return <div>No balance data available</div>;
  }
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold">{cachedBalance.name} ({cachedBalance.symbol})</h3>
      <p className="text-lg">{cachedBalance.balance} {cachedBalance.symbol}</p>
      {loading && <p className="text-sm text-gray-500">Refreshing...</p>}
      {cachedBalance.isStale && !loading && (
        <p className="text-sm text-yellow-500">Data may be stale</p>
      )}
      <p className="text-xs text-gray-400">
        Last updated: {new Date(cachedBalance.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}

export function TokenBalance(props: TokenBalanceProps) {
  return (
    <ConvexSafeComponent
      fallback={
        <div className="p-4 border rounded-md bg-gray-50">
          <p>Unable to load token balance</p>
        </div>
      }
    >
      <TokenBalanceContent {...props} />
    </ConvexSafeComponent>
  );
}
