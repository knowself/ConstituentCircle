"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { Id } from "./_generated/dataModel";

/**
 * Creates an admin user for testing authentication
 * This is an internal action that should only be used for setup/testing
 */
export const createAdminUser = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    userId: v.optional(v.id("users")),
  }),
  handler: async (ctx: any, args) => {
    try {
      // Import the internal mutation for creating an admin user
      const { internal } = await import("./_generated/api");
      
      // Check if user already exists
      const existingUser = await ctx.runQuery(async (ctx: any) => {
        return await ctx.db
          .query("users")
          .withIndex("by_email", (q: any) => q.eq("email", args.email))
          .unique();
      });
      
      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
          userId: existingUser._id,
        };
      }
      
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(args.password, 10);
      
      // Create the user with admin role
      const userId = await ctx.runMutation(async (ctx: any) => {
        const userId = await ctx.db.insert("users", {
          email: args.email,
          passwordHash: hashedPassword,
          role: "admin",
          createdAt: Date.now(),
          name: "Joe Terry",
        });
        
        // Create a profile for the user
        await ctx.db.insert("profiles", {
          email: args.email,
          role: "admin",
          userId,
          displayname: "Joe Terry",
          createdAt: Date.now(),
          governmentLevel: 'Federal',
          jurisdiction: 'State',
          metadata: {
            firstName: "Joe",
            lastName: "Terry",
            employmentType: 'permanent',
          }
        });
        
        return userId;
      });
      
      return {
        success: true,
        message: "Admin user created successfully",
        userId,
      };
    } catch (error) {
      console.error("Error creating admin user:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});