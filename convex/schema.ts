// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export type ValidGovernmentLevel = "federal" | "state" | "county" | "municipal" | "school_district";

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    displayname: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("representative"),
      v.literal("company_admin"),
      v.literal("constituent")
    ),
    authProvider: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        employmentType: v.optional(
          v.union(
            v.literal("permanent"),
            v.literal("seasonal"),
            v.literal("intern"),
            v.literal("elected"),
            v.literal("volunteer")
          )
        ),
      })
    ),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_name", ["name"])
    .index("by_clerkId", ["clerkId"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastAccessedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expiry", ["expiresAt"]),

  profiles: defineTable({
    userId: v.optional(v.id("users")),
    email: v.string(),
    name: v.string(),
    displayname: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("representative"),
      v.literal("company_admin"),
      v.literal("constituent")
    ),
    governmentLevel: v.optional(
      v.union(
        v.literal("federal"),
        v.literal("state"),
        v.literal("county"),
        v.literal("municipal"),
        v.literal("school_district")
      )
    ),
    jurisdiction: v.string(),
    district: v.string(),
    party: v.optional(v.string()),
    position: v.optional(v.string()),
    termStart: v.optional(v.number()),
    termEnd: v.optional(v.number()),
    metadata: v.object({
      employmentType: v.union(
        v.literal("permanent"),
        v.literal("seasonal"),
        v.literal("intern"),
        v.literal("elected"),
        v.literal("volunteer")
      ),
      firstName: v.string(),
      lastName: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_district_and_role", ["district", "role"]),

  communications: defineTable({
    representativeId: v.id("users"),
    constituentId: v.id("users"),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("read")
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_representative", ["representativeId"])
    .index("by_constituent", ["constituentId"]),

  constituents: defineTable({
    userId: v.id("users"),
    district: v.string(),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_district", ["district"]),
});
