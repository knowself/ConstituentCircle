// convex/profile_diagnostics.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define the expected profile document shape
interface ProfileDoc {
  _id: Id<"profiles">;
  governmentLevel?: string; // Adjust based on your schema
}

// Define the return type
interface LevelCheckResult {
  _id: Id<"profiles">;
  governmentLevel: string | undefined;
}

export const checkLevels = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("profiles"),
      governmentLevel: v.optional(v.string()),
    })
  ),
  handler: async (ctx): Promise<LevelCheckResult[]> => {
    const profiles = await ctx.db.query("profiles").collect();
    return profiles.map((p: ProfileDoc) => ({
      _id: p._id,
      governmentLevel: p.governmentLevel,
    }));
  },
});