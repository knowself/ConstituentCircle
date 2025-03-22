import { query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check if an admin user exists and has a password set
 */
export const checkAdminUser = query({
  args: {},
  returns: v.object({
    exists: v.boolean(),
    hasPassword: v.boolean(),
    email: v.optional(v.string())
  }),
  handler: async (ctx) => {
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    
    if (!adminUser) {
      return {
        exists: false,
        hasPassword: false
      };
    }
    
    return {
      exists: true,
      hasPassword: !!adminUser.passwordHash,
      email: adminUser.email
    };
  },
});

/**
 * Check if an admin user exists and has a password set
 * This is an internal query that should only be used for debugging
 */
export const checkAdminUserInternal = internalQuery({
  args: {
    email: v.string(),
  },
  returns: v.object({
    exists: v.boolean(),
    hasPassword: v.boolean(),
    role: v.optional(v.string()),
    fields: v.optional(v.any()),
  }),
  handler: async (ctx, args) => {
    try {
      // Find the user
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();

      if (!user) {
        return {
          exists: false,
          hasPassword: false,
        };
      }

      return {
        exists: true,
        hasPassword: !!user.passwordHash,
        role: user.role,
        fields: user,
      };
    } catch (error) {
      console.error("Error checking admin user:", error);
      return {
        exists: false,
        hasPassword: false,
      };
    }
  },
});
