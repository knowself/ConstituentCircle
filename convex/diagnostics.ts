import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkGovernmentLevels = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    
    // Group profiles by their government level
    const groupedLevels: { [key: string]: number } = {};
    
    for (const profile of profiles) {
      const level = profile.governmentLevel || 'null';
      groupedLevels[level] = (groupedLevels[level] || 0) + 1;
    }

    return {
      total: profiles.length,
      breakdown: groupedLevels,
      // Include a few example profiles for each level
      examples: Object.entries(groupedLevels).map(([level, count]) => ({
        level,
        count,
        samples: profiles
          .filter(p => (p.governmentLevel || 'null') === level)
          .slice(0, 3)
          .map(p => ({
            _id: p._id,
            governmentLevel: p.governmentLevel,
            name: p.name,
            email: p.email
          }))
      }))
    };
  }
});
