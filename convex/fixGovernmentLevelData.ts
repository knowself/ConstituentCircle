import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

type ValidGovernmentLevel = "federal" | "state" | "county" | "municipal" | "school_district";

export const fixData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    
    for (const profile of profiles) {
      if (!profile.governmentLevel) continue;
      
      const currentLevel = profile.governmentLevel.toLowerCase();
      let newLevel: ValidGovernmentLevel;
      
      // Map any variations to correct lowercase values
      switch (currentLevel) {
        case "state":
          newLevel = "state";
          break;
        case "federal":
          newLevel = "federal";
          break;
        case "county":
          newLevel = "county";
          break;
        case "municipal":
          newLevel = "municipal";
          break;
        case "school_district":
        case "school district":
          newLevel = "school_district";
          break;
        default:
          newLevel = "state"; // Default fallback
      }
      
      if (profile.governmentLevel !== newLevel) {
        await ctx.db.patch(profile._id, {
          governmentLevel: newLevel
        });
      }
    }
  }
});
