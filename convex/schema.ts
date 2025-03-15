import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const officeTypes = v.union(
  v.literal('State Representative'),
  v.literal('Senator'),
  v.literal('Mayor'),
  v.literal('Unknown')
);

// Define a more flexible validator for government levels that allows any string
// This is more maintainable than adding every possible government level value
const governmentLevels = v.string();

const jurisdictions = v.string();

const employmentTypes = v.union(
  v.literal('permanent'),
  v.literal('seasonal'),
  v.literal('intern'),
  v.literal('onloan'),
  v.literal('elected'),
  v.literal('citizen'),
  v.literal('campaign_manager'),
  v.literal('volunteer_coordinator'),
  v.literal('communications_director'),
  v.literal('field_director'),
  v.literal('fundraising_director')
);

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
      employmentType: v.optional(employmentTypes)
    })),
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
    displayname: v.optional(v.string())
  }).index("by_email", ["email"]).index("by_token", ["tokenIdentifier"]).index("by_role", ["role"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number())
  }).index("by_token", ["token"]),
  
  profiles: defineTable({
    email: v.string(),
    displayname: v.string(),
    name: v.optional(v.string()), 
    governmentLevel: governmentLevels,
    jurisdiction: jurisdictions,
    district: v.optional(v.string()),
    party: v.optional(v.string()),
    position: v.optional(v.string()),
    termStart: v.optional(v.number()),
    termEnd: v.optional(v.number()),
    role: v.optional(v.string()),
    metadata: v.object({
      firstName: v.string(),
      lastName: v.string(),
      employmentType: v.optional(employmentTypes)
    }),
    createdAt: v.number(),
    userId: v.optional(v.id('users'))
  }).index('by_email', ['email']).index('by_role', ['role']).index('by_user', ['userId']),
  
  communications: defineTable({
    representativeId: v.id('representatives'),
    constituentId: v.id('constituents'),
    messageType: v.string(),
    content: v.string(),
    channel: v.string(),
    status: v.string(),
    sentAt: v.number(),
    createdAt: v.number()
  }).index('by_representative', ['representativeId']).index('by_constituent', ['constituentId']).index('by_status', ['status']),
  
  constituents: defineTable({
    email: v.string(),
    fullName: v.string(),
    district: v.string(),
    preferences: v.object({
      contact_preference: v.string(),
      interests: v.array(v.string())
    }),
    createdAt: v.number(),
    userId: v.id('users')
  }).index('by_email', ['email']).index('by_district', ['district']).index('by_user', ['userId']),
  
  representatives: defineTable({
    email: v.string(),
    fullName: v.string(),
    district: v.string(),
    officeType: officeTypes,
    party: v.optional(v.string()),
    termStart: v.optional(v.number()),
    termEnd: v.optional(v.number()),
    createdAt: v.number(),
    userId: v.id('users')
  }).index('by_email', ['email']).index('by_district', ['district']).index('by_user', ['userId']),
  
  groups: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.string(),
    settings: v.object({
      visibility: v.string()
    }),
    metadata: v.object({
      priority: v.string(),
      meeting_schedule: v.string()
    }),
    createdAt: v.number(),
    representativeId: v.id('representatives')
  }).index('by_representative', ['representativeId']).index('by_type', ['type']),
  
  groupMembers: defineTable({
    groupId: v.id('groups'),
    constituentId: v.id('constituents'),
    role: v.optional(v.string()),
    joinedAt: v.number()
  }).index('by_group', ['groupId']).index('by_constituent', ['constituentId']),
  
  analytics: defineTable({
    period: v.string(),
    metrics: v.object({
      messages_sent: v.number(),
      response_rate: v.number(),
      avg_response_time: v.string()
    }),
    engagement: v.object({
      open_rate: v.number(),
      click_rate: v.number(),
      unsubscribe_rate: v.number()
    }),
    demographics: v.object({
      age_groups: v.object({}),
      locations: v.object({})
    }),
    trends: v.object({
      increasing_topics: v.array(v.string()),
      decreasing_topics: v.array(v.string())
    }),
    timestamp: v.number(),
    metadata: v.object({
      source: v.string(),
      version: v.string()
    })
  }).index('by_period', ['period'])
});