import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check if an admin user exists and has a password set
 * This is an internal query that should only be used for debugging
 */
export const checkAdminUser = internalQuery({
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
      
      // Return user details without sensitive information
      return {
        exists: true,
        hasPassword: !!user.passwordHash,
        role: user.role,
        fields: {
          id: user._id,
          email: user.email,
          role: user.role,
          // List all fields except passwordHash
          hasPasswordField: 'password' in user,
          fieldNames: Object.keys(user),
        },
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
