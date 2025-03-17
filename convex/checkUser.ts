import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Utility to check a user record by email
 */
export const checkUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    if (!user) {
      return {
        exists: false,
        message: "User not found",
      };
    }
    
    // Return user info without sensitive data
    return {
      exists: true,
      hasPasswordHash: !!user.passwordHash,
      role: user.role,
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  },
});
