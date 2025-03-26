import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const regenerateProfiles = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let createdCount = 0;
    
    for (const user of users) {
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
      
      if (!existingProfile) {
        await ctx.db.insert("profiles", {
          userId: user._id,
          email: user.email,
          name: user.name || user.email, // Add the required name field
          role: user.role,
          governmentLevel: "federal", // Use lowercase version
          jurisdiction: "state",
          district: "default",
          displayname: user.displayname || user.email,
          createdAt: Date.now(),
          metadata: {
            firstName: user.metadata?.firstName || "",
            lastName: user.metadata?.lastName || "",
            employmentType: user.metadata?.employmentType || "permanent"
          }
        });
        
        createdCount++;
      }
    }
    
    return createdCount;
  },
});
