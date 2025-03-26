import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Update to lowercase values
const governmentLevels = v.union(
  v.literal("federal"),
  v.literal("state"),
  v.literal("county"),
  v.literal("municipal"),
  v.literal("school_district")
);

export const updateGovernmentLevel = mutation({
  args: { 
    profileId: v.id("profiles"),
    newGovernmentLevel: governmentLevels
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      governmentLevel: args.newGovernmentLevel
    });
  }
});
