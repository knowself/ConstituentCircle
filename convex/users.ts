"use node";
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal as internalFunctions } from "./_generated/api";

// Update user
export const updateUser = internalAction({
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
    
    // Import the internal functions
    const { internal } = await import("./_generated/api");
    
    // Use the updateUserPassword function
    await ctx.runMutation(internal.users.updateUserPassword, {
      userId,
      ...updates
    });
  },
});

// Define types for the action functions
type GetByEmailAction = typeof getByEmailAction;
type GetAdminUserAction = typeof getAdminUserAction;

// Pre-define the action functions to avoid circular references
const getByEmailAction = internalAction({
  args: {
    email: v.string()
  },
  handler: async (ctx, args): Promise<any> => {
    // We need to use internalFunctions to get a reference to a query function
    return await ctx.runQuery(internalFunctions.users_queries.getUserByEmail, { email: args.email });
  },
});

const getAdminUserAction = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    // We need to use internalFunctions to get a reference to a query function
    return await ctx.runQuery(internalFunctions.users_queries.getAdminUserQuery, {});
  },
});

// Export the actions with proper type annotations
export const getByEmail: GetByEmailAction = getByEmailAction;
export const getAdminUser: GetAdminUserAction = getAdminUserAction;

// Define types for internal functions to avoid circular references
type InternalActions = {
  create: typeof createUserAction;
  updateUserPassword: typeof updateUserPasswordAction;
};

// Pre-define the action functions to avoid circular references
const createUserAction = internalAction({
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
  handler: async (ctx, args): Promise<Id<"users">> => {
    return await ctx.runMutation(internalFunctions.users.internalMutations.createUser, args);
  },
});

const updateUserPasswordAction = internalAction({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.runMutation(internalFunctions.users.internalMutations.updateUserPassword, args);
  },
});

// Internal functions for use within other Convex functions
export const internal: InternalActions = {
  create: createUserAction,
  updateUserPassword: updateUserPasswordAction,
};

// Internal mutations for database operations
export const internalMutations = {
  // Create a user
  createUser: internalMutation({
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
    handler: async (ctx, args): Promise<Id<"users">> => {
      return await ctx.db.insert("users", args);
    },
  }),

  // Update user password
  updateUserPassword: internalMutation({
    args: {
      userId: v.id("users"),
      passwordHash: v.string(),
    },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, {
        passwordHash: args.passwordHash,
      });
    },
  }),
};