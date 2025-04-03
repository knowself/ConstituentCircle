"use node";

import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Internal mutation to create the user and profile
const createUserAndProfile = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: "admin",
      createdAt: Date.now(),
      name: "Joe Terry",
      authProvider: "password",
      metadata: {
        firstName: "Joe",
        lastName: "Terry",
        employmentType: "permanent"
      }
    });
    
    await ctx.db.insert("profiles", {
      email: args.email,
      role: "admin",
      userId,
      name: "Joe Terry",
      displayname: "Joe Terry",
      createdAt: Date.now(),
      governmentLevel: "federal",
      jurisdiction: "state",
      district: "default",
      metadata: {
        firstName: "Joe",
        lastName: "Terry",
        employmentType: "permanent"
      }
    });
    
    return userId;
  }
});

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
  handler: async (ctx, args): Promise<{
    success: boolean;
    message: string;
    userId?: Id<"users">;
  }> => {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(args.password, 10);
    
    // Create the user with admin role using the internal mutation
    let userId: Id<"users">;
    try {
      userId = await ctx.runMutation(internal.createUserAndProfile, {
        email: args.email,
        passwordHash: hashedPassword,
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create admin user",
        userId: undefined
      };
    }
    
    return {
      success: true,
      message: "Admin user created successfully",
      userId,
    };
  }
});
