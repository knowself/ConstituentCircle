import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";

export const inviteUser = action({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("representative")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail
    });

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    // Generate temporary password
    const tempPassword = `temp-${crypto.randomUUID()}`;
    
    // Hash the temporary password
    const passwordHash = await ctx.runAction(internal.authInternal.hashPassword, {
      password: tempPassword
    });

    // Create the user
    const userId = await ctx.runMutation(internal.users.createUser, {
      email: normalizedEmail,
      name: args.name,
      passwordHash,
      role: args.role,
      authProvider: "email",
      metadata: {},
      createdAt: Date.now()
    });

    // TODO: Send invitation email with temporary password
    // This would typically involve calling an email service

    return {
      userId,
      tempPassword // In production, this should only be sent via email
    };
  },
});

export const resetPassword = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    
    // Find user
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Generate temporary password
    const tempPassword = `reset-${crypto.randomUUID()}`;
    
    // Hash the temporary password
    const passwordHash = await ctx.runAction(internal.authInternal.hashPassword, {
      password: tempPassword
    });

    // Update user's password
    await ctx.runMutation(internal.authInternal.updatePassword, {
      userId: user._id,
      passwordHash
    });

    // TODO: Send password reset email
    // This would typically involve calling an email service

    return {
      success: true,
      tempPassword // In production, this should only be sent via email
    };
  },
});
