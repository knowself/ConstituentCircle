"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

/**
 * Set password for an admin user
 * This is an internal action that should only be used for setup/testing
 */
export const setAdminPassword = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    try {
      // Import the internal functions to get the getUserByEmail function
      const { internal } = await import("./_generated/api");
      
      // Find the user
      const user = await ctx.runQuery(internal.users_queries.getUserByEmail, { email: args.email });
      
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
      
      // Check if user is admin
      if (user.role !== "admin") {
        return {
          success: false,
          message: "User is not an admin",
        };
      }
      
      // Hash the password
      const passwordHash = await bcrypt.hash(args.password, 10);
      
      // Update the user
      // Use a proper mutation function
      await ctx.runMutation(internal.users.updateUserPassword, {
        userId: user._id,
        passwordHash,
      });
      
      return {
        success: true,
        message: "Admin password set successfully",
      };
    } catch (error) {
      console.error("Error setting admin password:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
