# Convex Configuration Documentation

## Overview

Constituent Circle uses Convex as its backend service, providing database storage, real-time data synchronization, and serverless functions. This document provides a comprehensive overview of our Convex implementation, including schema design, function patterns, authentication system, and best practices.

## Schema Design

The database schema is defined in `convex/schema.ts` and includes the following tables:

### Users Table
```typescript
users: defineTable({
  email: v.string(),
  name: v.string(),
  displayname: v.optional(v.string()),
  passwordHash: v.optional(v.string()),
  role: v.union(
    v.literal("admin"),
    v.literal("user"),
    v.literal("representative"),
    v.literal("company_admin"),
    v.literal("constituent")
  ),
  authProvider: v.string(),
  metadata: v.object({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    employmentType: v.optional(
      v.union(
        v.literal("permanent"),
        v.literal("seasonal"),
        v.literal("intern"),
        v.literal("elected"),
        v.literal("volunteer")
      )
    ),
  }),
  createdAt: v.number(),
  lastLoginAt: v.optional(v.number()),
})
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_name", ["name"])
```

### Sessions Table
```typescript
sessions: defineTable({
  userId: v.id("users"),
  token: v.string(),
  expiresAt: v.number(),
  createdAt: v.number(),
  lastAccessedAt: v.optional(v.number()),
})
  .index("by_token", ["token"])
  .index("by_user", ["userId"])
  .index("by_expiry", ["expiresAt"])
```

### Profiles Table
```typescript
profiles: defineTable({
  userId: v.optional(v.id("users")),
  email: v.string(),
  name: v.string(),
  displayname: v.string(),
  role: v.union(
    v.literal("admin"),
    v.literal("user"),
    v.literal("representative"),
    v.literal("company_admin"),
    v.literal("constituent")
  ),
  governmentLevel: v.optional(
    v.union(
      v.literal("federal"),
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district")
    )
  ),
  jurisdiction: v.string(),
  district: v.string(),
  party: v.optional(v.string()),
  position: v.optional(v.string()),
  termStart: v.optional(v.number()),
  termEnd: v.optional(v.number()),
  metadata: v.object({
    employmentType: v.union(
      v.literal("permanent"),
      v.literal("seasonal"),
      v.literal("intern"),
      v.literal("elected"),
      v.literal("volunteer")
    ),
    firstName: v.string(),
    lastName: v.string(),
  }),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
  .index("by_email", ["email"])
  .index("by_user", ["userId"])
  .index("by_role", ["role"])
  .index("by_district_and_role", ["district", "role"])
```

### Communications Table
```typescript
communications: defineTable({
  representativeId: v.id("users"),
  constituentId: v.id("users"),
  subject: v.string(),
  message: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("read")
  ),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
  .index("by_representative", ["representativeId"])
  .index("by_constituent", ["constituentId"])
```

### Constituents Table
```typescript
constituents: defineTable({
  userId: v.id("users"),
  district: v.string(),
  address: v.object({
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
  }),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_district", ["district"])
```

## Function Organization

Convex functions are organized by domain and type:

- **Queries**: Read-only functions that fetch data
- **Mutations**: Functions that modify data
- **Actions**: Functions that can perform side effects like calling external APIs

### File Structure

```
convex/
├── admin_queries.ts       # Admin-specific queries
├── auth.ts                # Authentication functions
├── authInternal.ts        # Internal authentication utilities
├── communications.ts      # Communication-related functions
├── constituents.ts        # Constituent-related functions
├── schema.ts              # Database schema definition
├── users_queries.ts       # User-related queries
├── users_mutations.ts     # User-related mutations
├── users_actions.ts       # User-related actions
└── validators.ts          # Shared validators
```

## Authentication System

The authentication system implements a dual-path login strategy to handle both admin and non-admin users securely.

### Login Paths

1. **Admin Login** (`/admin/login`)
   - Restricted to users with the 'admin' role
   - Requires a properly set password
   - Strict role validation before authentication
   - Redirects to admin dashboard after login

2. **Main Login** (`/login`)
   - Primary login path for all non-admin users
   - Supports all roles except admin
   - Smart redirection after login based on user role

### Authentication Flow

1. **User Authentication Process**
   ```typescript
   // Context: AuthContext.tsx
   const signIn = async (email: string, password: string, role?: Role) => {
     // Attempt login and receive session token
     const result = await login({ email, password, role });
     if (result.success) {
       // Store session token
       localStorage.setItem('sessionToken', result.token);
       // Refresh user state
       window.location.reload();
     }
   };
   ```

2. **Login Validation** (Convex Mutation)
   - User lookup by email
   - Password verification using bcrypt
   - Role validation
   - Session token generation and storage

3. **Role-Based Access**
   ```typescript
   // Admin protection
   if (args.role === 'admin' && user.role !== 'admin') {
     return { success: false, error: "Unauthorized: Admin access only" };
   }
   
   // Prevent admin login through main path
   if (args.role && args.role !== 'admin' && user.role === 'admin') {
     return { success: false, error: "Please use admin login" };
   }
   ```

### Security Features

1. **Password Handling**
   - Passwords hashed using bcrypt
   - No plaintext password storage
   - Secure password comparison

2. **Session Security**
   - Unique session tokens
   - 7-day session duration
   - Automatic session cleanup
   - Clear session data on logout

## Convex Function Patterns

### Query Pattern

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  returns: v.object({
    _id: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});
```

### Mutation Pattern

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Check if user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update user
    await ctx.db.patch(userId, updates);
    return userId;
  },
});
```

### Action Pattern (Node.js Runtime)

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    try {
      // External API call or Node.js functionality
      const result = await sendEmailWithNodemailer(args.to, args.subject, args.body);
      
      // Log the action in the database
      await ctx.runMutation(internal.communications.logEmailSent, {
        to: args.to,
        subject: args.subject,
        success: true,
      });
      
      return true;
    } catch (error) {
      // Log the failure
      await ctx.runMutation(internal.communications.logEmailSent, {
        to: args.to,
        subject: args.subject,
        success: false,
        error: error.message,
      });
      
      return false;
    }
  },
});
```

## Best Practices

### 1. Function Registration

- Use `internalQuery`, `internalMutation`, and `internalAction` to register internal functions that aren't part of the public API
- Use `query`, `mutation`, and `action` to register public functions
- Always include argument and return validators for all Convex functions

### 2. Validators

- Always use the appropriate validator for each data type
- Use `v.union()` for discriminated union types
- Use `v.optional()` for optional fields
- Use `v.null()` when returning null values

### 3. Function Calling

- Use `ctx.runQuery` to call a query from a query, mutation, or action
- Use `ctx.runMutation` to call a mutation from a mutation or action
- Use `ctx.runAction` to call an action from an action
- Always use function references (not direct function calls)

### 4. Error Handling

- Use `ConvexError` for expected errors that should be handled by the client
- Use standard JavaScript errors for unexpected errors
- Implement proper error boundaries in React components

### 5. Pagination

- Use the pagination pattern for queries that return large result sets
- Implement cursor-based pagination for efficiency

### 6. TypeScript

- Use the `Id<'tableName'>` type for document IDs
- Be strict with types, particularly around document IDs
- Use `as const` for string literals in discriminated union types

## Common Issues and Solutions

### 1. Node.js Runtime vs. Convex Runtime

Files with `"use node";` must only contain `action` functions, not `query` or `mutation` functions.

```typescript
// INCORRECT: Using query in a Node.js runtime file
// File with "use node"; at the top
export const getUserByEmail = internalQuery({ ... })

// CORRECT: Using action in a Node.js runtime file
export const getUserByEmail = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const { internal } = await import("./_generated/api");
    const result = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
    return result;
  },
});
```

### 2. Return Type Mismatches

Ensure function returns exactly match the structure defined in the `returns` field.

```typescript
// INCORRECT: Return type mismatch
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      role: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user; // Error: user structure doesn't match the return type
  },
});

// CORRECT: Return type matches
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.object({
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      role: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    return {
      userId: user._id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'constituent'
    };
  },
});
```

### 3. Circular References in API Imports

Use `internal` instead of `api` when importing functions to avoid circular references.

```typescript
// INCORRECT: Using api which can cause circular references
const { api } = await import("./_generated/api");
const result = await ctx.runQuery(api.users_queries.getUserByEmail, { email: args.email });

// CORRECT: Using internal which avoids circular references
const { internal } = await import("./_generated/api");
const result = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
```

## Debugging Tips

1. **Temporary Type Checking Bypass**: Use `--typecheck=disable` to temporarily bypass TypeScript errors during development
   ```bash
   npx convex dev --typecheck=disable
   ```

2. **Verbose Mode**: Run Convex in verbose mode to see more detailed error messages
   ```bash
   npx convex dev -v
   ```

3. **Check Runtime Environment**: Verify which runtime your file is using by checking the Convex server output

4. **Function References**: When using `ctx.runQuery` or `ctx.runMutation`, always use function references from the `internal` import rather than inline functions

5. **Return Type Validation**: Always ensure your function's return value exactly matches the structure defined in the `returns` field

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex TypeScript API Reference](https://docs.convex.dev/api/typescript)
- [Convex React Hooks](https://docs.convex.dev/api/react)