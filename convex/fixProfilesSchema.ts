import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fixGovernmentLevels = mutation({
  args: {},
  returns: v.object({
    fixed: v.number(),
    message: v.string()
  }),
  handler: async (ctx) => {
    // Get all profiles
    const profiles = await ctx.db.query("profiles").collect();
    
    let fixedCount = 0;
    
    // Check each profile for schema validation issues
    for (const profile of profiles) {
      let needsUpdate = false;
      const updates: Record<string, string> = {};
      
      // Check and fix governmentLevel if needed
      if (typeof profile.governmentLevel === "string" && 
          profile.governmentLevel.toLowerCase() === "state" && 
          profile.governmentLevel !== "State") {
        updates.governmentLevel = "State";
        needsUpdate = true;
      }
      
      // Check and fix jurisdiction if needed
      if (typeof profile.jurisdiction === "string") {
        const validJurisdictions = ["National", "State", "County", "Municipal", "District", "Precinct"];
        // Use type assertion to handle the string comparison safely
        const jurisdictionValue = profile.jurisdiction as string;
        if (jurisdictionValue === "Texas District 15" || !validJurisdictions.includes(jurisdictionValue)) {
          updates.jurisdiction = "District";
          needsUpdate = true;
        }
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        await ctx.db.patch(profile._id, updates);
        fixedCount++;
      }
    }
    
    return {
      fixed: fixedCount,
      message: `Fixed ${fixedCount} profile(s) with schema validation issues`
    };
  },
});
