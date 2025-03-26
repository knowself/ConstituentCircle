import { mutation } from "./_generated/server";
import { v } from "convex/values";

type ValidGovernmentLevel = "federal" | "state" | "county" | "municipal" | "school_district";

export const fixGovernmentLevels = mutation({
  args: {},
  returns: v.object({
    fixed: v.number(),
    errors: v.array(v.string())
  }),
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    let fixedCount = 0;
    const errors: string[] = [];

    const fixes: Record<string, ValidGovernmentLevel> = {
      "State": "state",
      "STATE": "state",
      "state": "state",
      "Federal": "federal",
      "FEDERAL": "federal",
      "federal": "federal",
      "County": "county",
      "COUNTY": "county",
      "county": "county",
      "Municipal": "municipal",
      "MUNICIPAL": "municipal",
      "municipal": "municipal",
      "School District": "school_district",
      "SCHOOL DISTRICT": "school_district",
      "school_district": "school_district",
      "school district": "school_district"
    };

    for (const profile of profiles) {
      try {
        const currentLevel = profile.governmentLevel;
        if (!currentLevel) continue;

        const correctLevel = fixes[currentLevel];
        if (correctLevel && currentLevel !== correctLevel) {
          await ctx.db.patch(profile._id, {
            governmentLevel: correctLevel
          });
          fixedCount++;
        }
      } catch (error) {
        errors.push(`Error fixing profile ${profile._id}: ${error}`);
      }
    }

    return {
      fixed: fixedCount,
      errors
    };
  }
});
