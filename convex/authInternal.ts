// convex/authInternal.ts
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { ActionCtxWithAuth, MutationCtxWithAuth } from "./types";

export const hashPassword = internalAction({
  args: { password: v.string() },
  returns: v.string(),
  handler: async (ctx: ActionCtxWithAuth, args) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(args.password, salt);
  },
});

export const verifyPassword = internalAction({
  args: { password: v.string(), hash: v.string() },
  returns: v.boolean(),
  handler: async (ctx: ActionCtxWithAuth, args) => {
    return await bcrypt.compare(args.password, args.hash);
  },
});

export const generateToken = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx: MutationCtxWithAuth) => {
    const timestamp = Date.now().toString(36);
    return `${Math.random().toString(36).substring(2, 15)}${timestamp}${Math.random().toString(36).substring(2, 15)}`;
  },
});

export const createSession = internalMutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  },
  handler: async (ctx: MutationCtxWithAuth, args) => {
    await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: args.createdAt,
    });
  },
});

export const updateLastLogin = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx: MutationCtxWithAuth, args) => {
    await ctx.db.patch(args.userId, { lastLoginAt: Date.now() });
  },
});

export const updatePassword = internalMutation({
  args: { userId: v.id("users"), passwordHash: v.string() },
  handler: async (ctx: MutationCtxWithAuth, args) => {
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