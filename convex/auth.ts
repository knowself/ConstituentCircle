// convex/auth.ts
import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";
import type { AuthResponse, UserDoc, MutationCtx } from "./types";

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    
    // First find the user
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail
    });

    if (!user) {
      throw new ConvexError("Invalid email or password");
    }

    // Verify password
    const isValid = await ctx.runAction(internal.authInternal.verifyPassword, {
      password: args.password,
      hash: user.passwordHash || "",
    });

    if (!isValid) {
      throw new ConvexError("Invalid email or password");
    }

    // Generate session token
    const token = await ctx.runAction(internal.authInternal.generateToken, {
      userId: user._id,
    });

    // Create session
    await ctx.runMutation(internal.authInternal.createSession, {
      userId: user._id,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Update last login
    await ctx.runMutation(internal.authInternal.updateLastLogin, {
      userId: user._id
    });

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    return user;
  },
});

export const signup = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    
    // Check if user exists
    const existingUser = await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail
    });

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    // Hash password
    const passwordHash = await ctx.runAction(internal.authInternal.hashPassword, {
      password: args.password
    });

    // Create user
    const userId = await ctx.runMutation(internal.users.createUser, {
      email: normalizedEmail,
      name: args.name,
      passwordHash,
      role: "user",
      authProvider: "email",
      metadata: args.metadata || {},
      createdAt: Date.now()
    });

    // Generate token
    const token = await ctx.runAction(internal.authInternal.generateToken, {
      userId
    });

    // Create session
    await ctx.runMutation(internal.authInternal.createSession, {
      userId,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    });

    const user = await ctx.runQuery(internal.users.getUser, { userId });
    if (!user) {
      throw new ConvexError("Failed to create user");
    }

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return identity;
  },
});
