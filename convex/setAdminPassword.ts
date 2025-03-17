import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

/**
 * Set password for an admin user
 * This is an internal mutation that should only be used for setup/testing
 */
export const setAdminPassword = internalMutation({
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
      // Find the user
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();
      
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
      await ctx.db.patch(user._id, {
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
        message: `Error setting admin password: ${error}`,
      };
    }
  },
});
