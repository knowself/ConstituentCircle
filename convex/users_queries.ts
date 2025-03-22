import { query } from "./_generated/server";
import { v } from "convex/values";

// Get user role
export const getUserRole = query({
  args: {
    userId: v.id("users")
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.role;
  },
});

// Get user details
export const getUser = query({
  args: {
    userId: v.id("users")
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      email: v.string(),
      role: v.optional(v.string())
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  },
});

// These queries will be used by the actions but won't be directly exposed in Node.js files
export const getUserByEmail = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getAdminUserQuery = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
  },
});
