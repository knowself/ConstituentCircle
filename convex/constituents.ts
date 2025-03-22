import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

// Get constituent by user ID
export const getByUserId = query({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }

    const constituent = await ctx.db
      .query('constituents')
      .withIndex('by_user', q => q.eq('userId', args.userId as Id<'users'>))
      .first();

    return constituent;
  }
});

// Update constituent profile
export const update = mutation({
  args: {
    id: v.id('constituents'),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    metadata: v.optional(v.object({
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      ageRange: v.optional(v.string()),
      registrationDate: v.optional(v.number())
    })),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    county: v.optional(v.string()),
    town: v.optional(v.string()),
    preferences: v.optional(v.object({
      contact_preference: v.union(
        v.literal('email'),
        v.literal('phone'),
        v.literal('in-app'),
        v.literal('mail')
      ),
      interests: v.array(v.string()),
      notification_frequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('asap')
      ),
      subscribed_topics: v.array(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Update the constituent record
    const updatedId = await ctx.db.patch(id, updateData);
    
    // Update the lastEngagementAt timestamp to track this profile update
    await ctx.db.patch(id, { lastEngagementAt: Date.now() });

    return updatedId;
  }
});

// Get all constituents (for admin/representative use)
export const getAll = query({
  handler: async (ctx) => {
    const constituents = await ctx.db.query('constituents').collect();
    return constituents;
  }
});

// Get constituents by district
export const getByDistrict = query({
  args: {
    district: v.string()
  },
  handler: async (ctx, args) => {
    const constituents = await ctx.db
      .query('constituents')
      .withIndex('by_district', q => q.eq('district', args.district))
      .collect();

    return constituents;
  }
});

// Get active constituents
export const getActive = query({
  handler: async (ctx) => {
    const constituents = await ctx.db
      .query('constituents')
      .withIndex('by_status', q => q.eq('status', 'active'))
      .collect();

    return constituents;
  }
});
