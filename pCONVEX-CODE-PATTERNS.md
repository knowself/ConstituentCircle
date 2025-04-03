# Convex Code Patterns for Constituent Circle

**Version:** 1.0  
**Date:** March 30, 2025  

This document provides annotated code examples for common Convex patterns to integrate Convex into the Constituent Circle Next.js project, as outlined in the `Constituent Circle - Product Requirements Document (PRD)`. These patterns support user authentication, profiles, communication tools, district management, and administrative features, leveraging Convex’s real-time database and serverless functions.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Authentication Patterns](#authentication-patterns)
3. [Data Access Patterns](#data-access-patterns)
4. [Communication Patterns](#communication-patterns)
5. [District Management Patterns](#district-management-patterns)
6. [Error Handling Patterns](#error-handling-patterns)
7. [Integration Patterns](#integration-patterns)

---

## Schema Definition

### Core Schema with Indexes

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const governmentLevels = v.union(
  v.literal("federal"),
  v.literal("state"),
  v.literal("county"),
  v.literal("municipal"),
  v.literal("other")
);

export default defineSchema({
  // Users table for all roles (Constituent, Representative, Admin, Staff)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.optional(v.string(), "user"), // Default: "user" (Constituent)
    address: v.optional(v.string()), // For district lookup
    districtId: v.optional(v.id("districts")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_district", ["districtId"]),

  // Sessions table for secure token management
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"]),

  // Districts table for representative jurisdictions
  districts: defineTable({
    name: v.string(), // e.g., "CA-12"
    governmentLevel: governmentLevels,
    jurisdiction: v.string(), // e.g., "California"
    zipCodes: v.array(v.string()), // Simplified boundary representation
    createdAt: v.number(),
    updatedAt: v.number(),
    source: v.string(), // e.g., "GoogleCivic", "Manual"
  })
    .index("by_jurisdiction", ["jurisdiction", "governmentLevel"]),

  // Representatives table linked to districts
  representatives: defineTable({
    userId: v.id("users"), // Links to users table for Representative role
    districtId: v.id("districts"),
    bio: v.optional(v.string()),
    party: v.optional(v.string()),
    termStart: v.number(),
    termEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_district", ["districtId"])
    .index("by_user", ["userId"]),

  // Messages table for communication tools
  messages: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_recipient", ["recipientId", "sentAt"]),
});
```

**Notes**: 
- Supports all PRD roles via `users` with RBAC via `role`.
- `districts` and `representatives` enable directory and lookup features.
- `messages` supports secure messaging with real-time indexing.

---

## Authentication Patterns

### Login Function

```typescript
// convex/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
    if (!user || !(await bcrypt.compare(args.password, user.passwordHash))) {
      throw new Error("Invalid email or password");
    }
    const token = crypto.randomUUID(); // Simple token generation
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    return {
      token,
      user: { _id: user._id, email: user.email, role: user.role || "user", name: user.name },
    };
  },
});
```

**Notes**: 
- Simplifies the original by removing internal actions, using bcrypt directly.
- Supports PRD’s secure login and RBAC requirements.

### Logout Function

```typescript
// convex/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { success: true };
  },
});
```

**Notes**: Implements PRD’s logout functionality with session invalidation.

### Get Current User

```typescript
// convex/auth.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return {
      _id: user._id,
      email: user.email,
      role: user.role || "user",
      name: user.name,
      districtId: user.districtId,
    };
  },
});
```

**Notes**: Simplifies the original, removing `skip` option, and adds `districtId` for Constituent Circle context.

---

## Data Access Patterns

### List Users with Pagination

```typescript
// convex/users.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listUsers = query({
  args: { limit: v.optional(v.number()), cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const results = await ctx.db
      .query("users")
      .order("desc")
      .paginate({ numItems: limit, cursor: args.cursor || null });
    return {
      users: results.page.map((u) => ({ _id: u._id, email: u.email, role: u.role, name: u.name })),
      nextCursor: results.isDone ? null : results.continueCursor,
    };
  },
});
```

**Notes**: Supports PRD’s admin user management with paginated access.

### Search Representatives

```typescript
// convex/representatives.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchRepresentatives = query({
  args: {
    searchTerm: v.optional(v.string()),
    districtId: v.optional(v.id("districts")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("representatives");
    if (args.districtId) {
      query = query.withIndex("by_district", (q) => q.eq("districtId", args.districtId));
    }
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      query = query.filter((q) => q.contains(q.field("name").lower(), term));
    }
    return await query.take(args.limit || 20);
  },
});
```

**Notes**: Implements PRD’s directory and search feature for representatives.

---

## Communication Patterns

### Send Message

```typescript
// convex/messages.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: { recipientId: v.id("users"), content: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const senderId = identity.subject;
    return await ctx.db.insert("messages", {
      senderId,
      recipientId: args.recipientId,
      content: args.content,
      sentAt: Date.now(),
    });
  },
});
```

### Get Messages (Real-Time)

```typescript
// convex/messages.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.userId))
      .order("desc")
      .take(50); // Limit for performance
  },
});
```

**Notes**: Supports PRD’s secure messaging with Convex real-time sync.

---

## District Management Patterns

### Fetch District Data (External API)

```typescript
// convex/districts.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const fetchDistrictData = action({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
    const url = `https://civicinfo.googleapis.com/civicinfo/v2/representatives?key=${apiKey}&address=${encodeURIComponent(args.address)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    for (const [ocdId, division] of Object.entries(data.divisions)) {
      const districtId = await ctx.db.insert("districts", {
        name: division.name,
        governmentLevel: "federal", // Simplified; refine with logic
        jurisdiction: "USA", // Simplified
        zipCodes: [args.address.split(" ").pop()],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        source: "GoogleCivic",
      });
      const officials = data.officials.filter((o) => division.officeIndices?.includes(o.index));
      for (const official of officials) {
        const userId = await ctx.db.insert("users", {
          email: official.emails?.[0] || `${official.name.toLowerCase().replace(" ", ".")}@example.com`,
          name: official.name,
          passwordHash: "temp-hash", // Placeholder; requires signup flow
          role: "representative",
          createdAt: Date.now(),
        });
        await ctx.db.insert("representatives", {
          userId,
          districtId,
          bio: "Imported from Google Civic",
          party: official.party,
          termStart: Date.now(),
          termEnd: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
    return { success: true };
  },
});
```

### Get District by ZIP

```typescript
// convex/districts.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDistrictByZip = query({
  args: { zipCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("districts")
      .filter((q) => q.contains(q.field("zipCodes"), args.zipCode))
      .first();
  },
});
```

**Notes**: 
- Addresses PRD’s open question on district management with initial API integration.
- Real-time ZIP-based lookup for constituents.

---

## Error Handling Patterns

### Try-Catch in React Component

```tsx
// components/LoginForm.tsx
'use client';

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useAction(api.auth.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login({ email, password });
      localStorage.setItem("sessionToken", result.token);
      // Redirect or update state
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
       <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
```

**Notes**: Simplifies the original, focusing on Convex action with fallback UI.

---

## Integration Patterns

### Next.js API Route Fallback

```typescript
// app/api/login/route.ts
import { NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as LoginRequest;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    const response = await fetch(`${convexUrl}/api/action/auth:login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: { email, password } }),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Login error" }, { status: 500 });
  }
}
```

**Notes**: Retained as a fallback for non-Convex environments.

---

### Updates Made
1. **Intro Updated**: Aligned with Constituent Circle PRD, removed blockchain focus.
2. **Schema**: Unified to support all PRD features (users, districts, reps, messages).
3. **Auth**: Simplified, removed internal actions, added district context.
4. **Data Access**: Added representative search for directory feature.
5. **Communication**: New section for PRD’s messaging tools.
6. **District Management**: Added API integration and ZIP lookup per PRD’s open question.
7. **Error Handling**: Streamlined React component example.
8. **Integration**: Kept Next.js API route, removed blockchain patterns.
9. **Annotations**: Enhanced for Constituent Circle context.

This updated document now fully supports the Constituent Circle PRD while maintaining Convex best practices. Let me know if you need further refinements!