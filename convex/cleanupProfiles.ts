// Fix the optional userId parameter
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const cleanupOrphanedProfiles = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all profiles
    const profiles = await ctx.db.query("profiles").collect();
    let deletedCount = 0;
    
    // Check each profile
    for (const profile of profiles) {
      // Skip profiles without a userId
      if (!profile.userId) continue;
      
      // Check if the user exists
      const user = await ctx.db.get(profile.userId);
      
      // If user doesn't exist, delete the profile
      if (!user) {
        await ctx.db.delete(profile._id);
        deletedCount++;
      }
    }
    
    return deletedCount;
  },
});