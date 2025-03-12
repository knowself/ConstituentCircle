import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get user role
export const getUserRole = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("_id"), args.userId))
      .first();
    
    return user?.metadata?.role || null;
  },
});

// Get user profile
export const getUserProfile = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("_id"), args.userId))
      .first();
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("profiles"),
    data: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      // Add other fields as needed
    }),
  },
  handler: async (ctx, args) => {
    // Update user profile
    await ctx.db.patch(args.userId, {
      // Map the input data to the appropriate fields
      ...(args.data.name && { full_name: args.data.name }),
      ...(args.data.email && { email: args.data.email }),
      // Add other field mappings as needed
    });
    return { success: true };
  },
});