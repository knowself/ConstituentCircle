import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const updateGovernmentLevel = mutation({
  args: {
    profileId: v.id("profiles"),
    newGovernmentLevel: v.union(
      v.literal('Federal'),
      v.literal('State'),
      v.literal('Local'),
      v.literal('County'),
      v.literal('Municipal'),
      v.literal('School District')
    ),
  },
  handler: async (ctx, args) => {
    const { profileId, newGovernmentLevel } = args;
    
    // Update the document with the correct case for governmentLevel
    await ctx.db.patch(profileId, {
      governmentLevel: newGovernmentLevel
    });
    
    return { success: true, message: `Updated governmentLevel to ${newGovernmentLevel}` };
  },
});
