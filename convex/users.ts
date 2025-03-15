import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get user role
export const getUserRole = query({
  args: {
    userId: v.id("users")
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.role
  },
});

// Get user profile
export const getUserProfile = query({
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

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string())
  },
  returns: v.object({
    success: v.boolean()
  }),
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.name) updates.name = args.name;
    if (args.email) updates.email = args.email;
    if (args.role) updates.role = args.role;
    
    await ctx.db.patch(args.userId, updates);
    
    return { success: true };
  },
});