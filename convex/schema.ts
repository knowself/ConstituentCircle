import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    authProvider: v.optional(v.string()),
    role: v.optional(v.string()),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      employmentType: v.optional(v.string()),
      role: v.optional(v.string())
    })),
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
    displayname: v.optional(v.string())
  }).index("by_email", ["email"]).index("by_token", ["tokenIdentifier"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number())
  }).index("by_token", ["token"]),
  
  profiles: defineTable({
    email: v.string(),
    name: v.string(),
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
    district: v.optional(v.string()),
    userId: v.optional(v.id("users"))
  }).index("by_user", ["userId"])
});