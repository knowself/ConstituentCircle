// convex/authInternal.ts
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./types";

export const hashPassword = internalAction({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(args.password, salt);
  },
});

export const verifyPassword = internalAction({
  args: { 
    password: v.string(), 
    hash: v.string() 
  },
  handler: async (ctx, args) => {
    return await bcrypt.compare(args.password, args.hash);
  },
});

export const generateToken = internalAction({
  args: {
    userId: v.optional(v.id("users"))
  },
  handler: async () => {
    return `${crypto.randomUUID()}-${Date.now().toString(36)}`;
  },
});

export const createSession = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number()
  },
  handler: async (ctx: MutationCtx, args) => {
    return await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now()
    });
  },
});

export const updateLastLogin = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx: MutationCtx, args) => {
    await ctx.db.patch(args.userId, { lastLoginAt: Date.now() });
  },
});

export const updatePassword = internalMutation({
  args: {
    userId: v.id("users"),
    passwordHash: v.string()
  },
  handler: async (ctx: MutationCtx, args) => {
    await ctx.db.patch(args.userId, { passwordHash: args.passwordHash });
  },
});

// Export aliases (unchanged)
export const internal_hashPassword = hashPassword;
export const internal_verifyPassword = verifyPassword;
export const internal_generateToken = generateToken;
export const internal_createSessionMutation = createSession;
export const internal_updateLastLoginMutation = updateLastLogin;
export const internal_updatePasswordMutation = updatePassword;

export const createSessionMutation = createSession;
export const updateLastLoginMutation = updateLastLogin;
export const updatePasswordMutation = updatePassword;
