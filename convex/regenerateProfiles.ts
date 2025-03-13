import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const regenerateProfiles = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    let createdCount = 0;
    
    // For each user, create a profile if it doesn't exist
    for (const user of users) {
      // Check if profile already exists
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
      
      if (!existingProfile) {
        // Create a profile for the user
        await ctx.db.insert("profiles", {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role || user.metadata?.role || "user",
          governmentLevel: "federal", // Add this field to the schema
        });
        
        createdCount++;
      }
    }
    
    return createdCount;
  },
});