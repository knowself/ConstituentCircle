import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table for authentication
  users: defineTable({
    email: v.string(),
    name: v.string(),
    // For email/password auth
    passwordHash: v.optional(v.string()),
    // For OAuth providers
    authProvider: v.optional(v.string()),
    providerId: v.optional(v.string()),
    // User role
    role: v.optional(v.string()),
    // Common fields
    lastLoginAt: v.number(),
    createdAt: v.number(),
    // Additional metadata
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      employmentType: v.optional(v.string()),
      role: v.optional(v.string())
    })),
  }).index("by_email", ["email"]),
  
  // Sessions table for token management
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
  
  // Keep existing profiles table for backward compatibility
  profiles: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    displayname: v.optional(v.string()),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      employmentType: v.optional(v.string()),
      password: v.optional(v.string()),
      role: v.optional(v.string())
    })),
    createdAt: v.optional(v.number()),
    governmentLevel: v.optional(v.string()),
    position: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
    party: v.optional(v.string()),
    termStart: v.optional(v.number()),
    termEnd: v.optional(v.number()),
    district: v.optional(v.string())
  }).index("by_email", ["email"])
});