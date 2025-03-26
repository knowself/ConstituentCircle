import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Define valid government levels type based on schema
type ValidGovernmentLevel = "federal" | "state" | "county" | "municipal" | "school_district";

const isValidGovernmentLevel = (level: string): level is ValidGovernmentLevel => {
  const validLevels: ValidGovernmentLevel[] = ["federal", "state", "county", "municipal", "school_district"];
  return validLevels.includes(level as ValidGovernmentLevel);
};

export const fixGovernmentLevels = mutation({
  args: {},
  returns: v.object({
    fixed: v.number(),
    message: v.string()
  }),
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    
    let fixedCount = 0;
    let errors: string[] = [];
    
    for (const profile of profiles) {
      console.log(`Profile ${profile._id}: Current governmentLevel = "${profile.governmentLevel}"`);
      
      if (!profile.governmentLevel) continue;

      // Convert to lowercase and normalize
      const currentLevel = profile.governmentLevel.toLowerCase();
      
      let newLevel: ValidGovernmentLevel | undefined;
      
      if (currentLevel === "school district") {
        newLevel = "school_district";
      } else if (isValidGovernmentLevel(currentLevel)) {
        newLevel = currentLevel;
      }
      
      if (newLevel && profile.governmentLevel !== newLevel) {
        try {
          console.log(`Updating ${profile._id} from "${profile.governmentLevel}" to "${newLevel}"`);
          await ctx.db.patch(profile._id, {
            governmentLevel: newLevel
          });
          fixedCount++;
        } catch (error) {
          const errorMsg = `Failed to update profile ${profile._id}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    return {
      fixed: fixedCount,
      message: `Fixed ${fixedCount} profile(s). ${errors.length ? `Errors: ${errors.join(", ")}` : ""}`
    };
  }
});
