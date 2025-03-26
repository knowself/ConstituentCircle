import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ValidGovernmentLevel } from "./schema";
import { Id } from "./_generated/dataModel";

export const fixGovernmentLevel = mutation({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    before: string;
    after: string;
  }> => {
    const profile = await ctx.db.get(args.profileId);
    
    if (!profile || !profile.governmentLevel) {
      return {
        success: false,
        before: "undefined",
        after: "undefined"
      };
    }

    // Map of valid government levels with case variations
    const validLevels: Record<string, ValidGovernmentLevel> = {
      'federal': 'federal',
      'Federal': 'federal',
      'FEDERAL': 'federal',
      'state': 'state',
      'State': 'state',
      'STATE': 'state',
      'county': 'county',
      'County': 'county',
      'COUNTY': 'county',
      'municipal': 'municipal',
      'Municipal': 'municipal',
      'MUNICIPAL': 'municipal',
      'school_district': 'school_district',
      'School_District': 'school_district',
      'SCHOOL_DISTRICT': 'school_district',
      // Common variations
      'state government': 'state',
      'State Government': 'state',
      'county government': 'county',
      'County Government': 'county',
      'city': 'municipal',
      'City': 'municipal',
      'town': 'municipal',
      'Town': 'municipal',
      'school': 'school_district',
      'School': 'school_district'
    };

    // Use direct lookup instead of toLowerCase to preserve exact matches
    const newValue = validLevels[profile.governmentLevel] || 'municipal';

    await ctx.db.patch(args.profileId, {
      governmentLevel: newValue
    });

    return {
      success: true,
      before: profile.governmentLevel,
      after: newValue
    };
  },
});