import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByRepresentative = query({
  args: { representativeId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("communications")
      .withIndex("by_representative", (q) => q.eq("representativeId", args.representativeId))
      .collect();
  }
});
