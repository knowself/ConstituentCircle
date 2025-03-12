import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    // For email/password auth
    passwordHash: v.optional(v.string()),
    // For OAuth providers
    authProvider: v.optional(v.string()),
    providerId: v.optional(v.string()),
    // Common fields
    lastLoginAt: v.number(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
});