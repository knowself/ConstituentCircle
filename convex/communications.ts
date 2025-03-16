import { query } from './_generated/server';
import { v } from 'convex/values';

export const getRecentCommunications = query({
  args: {
    representativeId: v.id("representatives"),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communications")
      .withIndex("by_representative", (q) => q.eq("representativeId", args.representativeId))
      .order("desc")
      .take(args.limit);
  },
});
