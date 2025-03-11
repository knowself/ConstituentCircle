import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Profiles table
  profiles: defineTable({
    email: v.string(),
    role: v.string(),
    displayname: v.optional(v.string()),
    metadata: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      employmentType: v.optional(v.string())
    }),
    created_at: v.string()
  }).index("by_email", ["email"]),

  // Representatives table
  representatives: defineTable({
    email: v.string(),
    full_name: v.string(),
    district: v.optional(v.string()),
    office_type: v.optional(v.string()),
    created_at: v.string()
  }).index("by_email", ["email"]),

  // Constituents table
  constituents: defineTable({
    email: v.optional(v.string()),
    full_name: v.string(),
    district: v.optional(v.string()),
    preferences: v.object({}),
    created_at: v.string()
  }).index("by_email", ["email"]),

  // Groups table
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    settings: v.optional(v.object({})),
    metadata: v.optional(v.object({})),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
    representative_id: v.optional(v.id("representatives")),
    analytics: v.optional(v.object({}))
  }).index("by_representative", ["representative_id"]),

  // Group Members table
  group_members: defineTable({
    group_id: v.id("groups"),
    constituent_id: v.id("constituents"),
    role: v.string(),
    joined_at: v.string()
  }).index("by_group", ["group_id"])
    .index("by_constituent", ["constituent_id"]),

  // Communications table
  communications: defineTable({
    representative_id: v.optional(v.id("representatives")),
    constituent_id: v.optional(v.id("constituents")),
    message_type: v.string(),
    content: v.string(),
    channel: v.string(),
    status: v.string(),
    sent_at: v.optional(v.string()),
    created_at: v.string()
  }).index("by_status", ["status"])
    .index("by_representative", ["representative_id"])
    .index("by_constituent", ["constituent_id"]),

  // Analytics table
  analytics: defineTable({
    period: v.string(),
    metrics: v.object({}),
    engagement: v.optional(v.object({})),
    demographics: v.optional(v.object({})),
    trends: v.optional(v.object({})),
    timestamp: v.string(),
    metadata: v.optional(v.object({}))
  })
});