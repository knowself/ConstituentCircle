"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal as internalFunctions } from "./_generated/api";

// Internal action to get user by email
export const getByEmail = internalAction({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(internalFunctions.users_queries.getUserByEmail, { email: args.email });
  },
});

// Internal action to get admin user
export const getAdminUser = internalAction({
  args: {},
  handler: async (ctx) => {
    return await ctx.runQuery(internalFunctions.users_queries.getAdminUserQuery, {});
  },
});

// Internal action to create a user
export const createUser = internalAction({
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
    return await ctx.runMutation(internalFunctions.users_mutations.createUser, args);
  },
});

// Internal action to update user password
export const updateUserPassword = internalAction({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internalFunctions.users_mutations.updateUserPassword, args);
  },
});
