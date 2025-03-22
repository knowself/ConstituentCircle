import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
  },
});

// Internal mutations for database operations
export const createUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    createdAt: v.number(),
    lastLoginAt: v.number(),
    metadata: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

// Update user password
export const updateUserPassword = internalMutation({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      passwordHash: args.passwordHash,
    });
  },
});
