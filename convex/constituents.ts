import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getConstituents = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("constituents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

export const getByDistrict = query({
  args: { district: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("constituents")
      .withIndex("by_district")
      .filter(q => q.eq("district", args.district))
      .collect();
  }
});
