# Constituent Circle

## The Mission

Constituent Circle creates AI-enabled tools for more effective, opinionated, goal-oriented communications, at scale, for representatives and constituents to be assured they are being heard by each other.

Our vision is to enable representatives to conduct, at scale, effective, opinionated, goal-oriented conversations with thousands, tens of thousands or more individuals and groups. This is our vision of the kinds of super powers representatives in a representative democracy need.

## The Technology

We combine artificial intelligence (AI) and natural language processing (NLP) to help representatives craft on-message emails efficiently while maintaining their own voice. Our system analyzes and learns from existing responses to create personalized templates tailored to the user's preference.

### Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Convex for database and real-time data synchronization
- **Authentication**: Convex Auth
- **Deployment**: Vercel

## Tech Stack Versions

- **@heroicons/react**: ^2.0.18
- **@types/nodemailer**: ^6.4.17
- **@vercel/analytics**: ^1.1.1
- **ai**: ^4.0.20
- **Convex**: ^1.20.0
- **Next.js**: ^15.2.0

## Convex Configuration

Constituent Circle uses Convex as its backend service, providing database storage, real-time data synchronization, and serverless functions.

### Schema Design

Our database schema is defined in `convex/schema.ts` and includes the following tables:

- **Users**: Stores user accounts with authentication information
- **Sessions**: Manages authentication sessions
- **Profiles**: Contains extended user profile information
- **Communications**: Tracks communications between representatives and constituents
- **Constituents**: Stores constituent-specific information

### Function Organization

Convex functions are organized by domain and type:

- **Queries**: Read-only functions that fetch data
- **Mutations**: Functions that modify data
- **Actions**: Functions that can perform side effects like calling external APIs

### Authentication System

The authentication system implements a dual-path login strategy:

1. **Admin Login** (`/admin/login`): Restricted to users with the 'admin' role
2. **Main Login** (`/login`): Primary login path for all non-admin users

### Best Practices

- Use appropriate validators for all function arguments and return types
- Organize functions by domain in separate files
- Use indexes for efficient queries
- Implement proper error handling

For detailed documentation on our Convex implementation, see the [Convex Configuration Documentation](memorybank/convexConfiguration.md).

## Examples

Our tools help representatives have more meaningful conversations with their constituents. For example, when discussing climate change:

1. The tool asks constituents about their biggest concerns
2. Provides representatives with relevant information about climate change impacts in their district
3. Enables representatives to gather constituent input on addressing climate change locally

These tools also help with:
- Project management
- Idea development and refinement
- Schedule and deadline tracking
- Position improvement and constituent service

## Authentication Implementation

### Overview

The authentication system implements a dual-path login strategy to handle both admin and non-admin users securely. The system is built using Convex for backend authentication and session management.

### Login Paths

1. **Admin Login** (`/admin/login`)
   - Restricted to users with the 'admin' role
   - Requires a properly set password
   - Strict role validation before authentication
   - Redirects to admin dashboard after login

2. **Main Login** (`/login`)
   - Primary login path for all non-admin users
   - Supports all roles except admin
   - Smart redirection after login based on user role:
     - Representatives → `/representative/dashboard`
     - Staff Members → `/staff/dashboard`
     - Other roles → `/dashboard`

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
   - Role validation:
     - Admin login: strict role check
     - Main login: ensures user is not an admin
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

### Available Roles

The system has distinct categories of roles that serve different purposes in the platform:

#### Primary Platform Users
```typescript
// The main users of the platform engaging in democratic discourse
| 'constituent'      // Private Citizens - Default platform role
| 'representative'   // Elected officials
```

#### Constituent Circle Company Roles
```typescript
// Roles for Constituent Circle company operations
| 'company_admin'     // Company administrators
| 'company_manager'   // Company management staff
| 'company_support'   // Support staff
| 'company_analyst'   // Data analysts
```

#### Representative Office & Campaign Roles
```typescript
// Roles for representative offices and campaign operations
| 'chief_of_staff'   // Office leadership
| 'communications_director' // Communications team lead
| 'office_admin'     // Office administrators
| 'staff_member'     // General staff
| 'campaign_manager' // Campaign leadership
| 'campaign_coordinator' // Campaign coordinators
| 'field_organizer'  // Field team
| 'volunteer_coordinator' // Volunteer management
| 'temp_staff'      // Temporary staff
| 'intern'          // Interns
| 'volunteer'       // Volunteers
```

#### System Administration
```typescript
// Constituent Circle technical leadership
| 'admin'           // System administrators - Platform technical management
```

Each role category has specific access levels and permissions appropriate for their function within the system. The role system is designed to support the full spectrum of users from constituents engaging with their representatives to the technical team managing the platform.

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

3. **Role Security**
   - Separate login paths for admin and non-admin users
   - Role validation before authentication
   - Role-based dashboard redirection
   - Prevention of admin access through main login

### Logout Implementation

```typescript
const logout = async () => {
  // Clear all auth-related items
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('user');
  localStorage.removeItem('auth');
  
  // Clear state
  setSessionToken(null);
  setUser(null);
  
  // Server-side logout
  if (token) {
    await logoutMutation({ token });
  }
};
```

### Key Files

1. `context/AuthContext.tsx`
   - Authentication context provider
   - Login/logout functionality
   - User state management

2. `convex/auth.ts`
   - Backend authentication logic
   - Session management
   - Password handling

3. `app/constituent/login/page.tsx` & `app/admin/login/page.tsx`
   - Login UI components
   - Form handling
   - Error management

4. `lib/types/roles.ts`
   - Role type definitions
   - Role categorization

### Future Considerations

1. **Password Reset Flow**
   - Implement secure password reset
   - Email verification
   - Temporary token generation

2. **Multi-Factor Authentication**
   - Plan for 2FA implementation
   - Support for authentication apps
   - Backup codes system

3. **Session Management**
   - Consider implementing refresh tokens
   - Add device tracking
   - Implement session revocation

4. **Role Management**
   - Role modification interface
   - Role hierarchy system
   - Permission granularity

## Convex TypeScript Troubleshooting Guide

### Common TypeScript Errors and Solutions

This project uses Convex as the backend, which requires specific patterns for different runtime environments. Below are common TypeScript errors we encountered and their solutions.

#### 1. Node.js Runtime vs. Convex Runtime

Convex has two different runtime environments:

- **Convex Runtime**: For standard queries and mutations
- **Node.js Runtime**: For files that use `"use node";` at the top, which enables Node.js features

**Error Pattern**: TypeScript errors when mixing query/mutation functions in Node.js runtime files

**Solution**: 
- Files with `"use node";` must only contain `action` functions, not `query` or `mutation` functions
- Convert all queries/mutations in Node.js runtime files to actions that use `ctx.runQuery()` and `ctx.runMutation()`

```typescript
// INCORRECT: Using query in a Node.js runtime file
// File: auth_utils.ts with "use node"; at the top
export const getUserByEmail = internalQuery({ ... })

// CORRECT: Using action in a Node.js runtime file
export const getUserByEmail = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Import the internal functions to get the getUserByEmail function
    const { internal } = await import("./_generated/api");
    // Use the getUserByEmail function from users_queries
    const result = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
    return result;
  },
});
```

#### 2. Return Type Mismatches

**Error Pattern**: Function return types don't match the expected types defined in the `returns` field

**Solution**: Ensure the function returns exactly match the structure defined in the `returns` field

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

#### 3. Inline Functions in Node.js Actions

**Error Pattern**: Using inline anonymous functions with `ctx.runQuery` or `ctx.runMutation`

**Solution**: Import and use proper function references instead of inline functions

```typescript
// INCORRECT: Using inline anonymous functions
await ctx.runQuery(async (ctx: any) => {
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", args.email))
    .unique();
});

// CORRECT: Using function references
const { internal } = await import("./_generated/api");
const user = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
```

#### 4. Circular References in API Imports

**Error Pattern**: "Type of property 'api' circularly references itself in mapped type"

**Solution**: Use `internal` instead of `api` when importing functions

```typescript
// INCORRECT: Using api which can cause circular references
const { api } = await import("./_generated/api");
const result = await ctx.runQuery(api.users_queries.getUserByEmail, { email: args.email });

// CORRECT: Using internal which avoids circular references
const { internal } = await import("./_generated/api");
const result = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
```

### Debugging Tips

1. **Temporary Type Checking Bypass**: Use `--typecheck=disable` to temporarily bypass TypeScript errors during development
   ```bash
   npx convex dev --typecheck=disable
   ```

2. **Verbose Mode**: Run Convex in verbose mode to see more detailed error messages
   ```bash
   npx convex dev -v
   ```

3. **Check Runtime Environment**: Verify which runtime your file is using by checking the Convex server output
   ```
   Convex's runtime modules: [...]
   Node.js runtime modules: [...]
   ```

4. **Function References**: When using `ctx.runQuery` or `ctx.runMutation`, always use function references from the `internal` import rather than inline functions

5. **Return Type Validation**: Always ensure your function's return value exactly matches the structure defined in the `returns` field

### Common Patterns

1. **Node.js Runtime Files**: Always use actions with `ctx.runQuery` and `ctx.runMutation`
2. **Convex Runtime Files**: Use standard queries and mutations
3. **Return Types**: Always define and match return types precisely
4. **Imports**: Use `internal` instead of `api` to avoid circular references

By following these patterns, you can avoid most TypeScript errors in Convex applications.

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 8.0.0

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/constituent-circle.git
cd constituent-circle

```
