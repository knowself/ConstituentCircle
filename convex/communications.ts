import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { Doc } from "./_generated/dataModel";

export const getByRepresentative = query({
  args: {
    representativeId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communications")
      .withIndex("by_representative", (q) =>
        q.eq("representativeId", args.representativeId),
      )
      .order("desc") // Order by creation time, newest first
      .paginate(args.paginationOpts);
  },
});
