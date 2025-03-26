import { query } from "./_generated/server";
import { v } from "convex/values";

export const displayTables = query({
  args: {
    tableName: v.string(),
  },
  // Explicitly tell Convex this returns any
  returns: v.any(),
  handler: async (ctx, args) => {
    switch (args.tableName) {
      case "profiles":
        const profiles = await ctx.db.query("profiles").collect();
        console.log("Profiles found:", profiles.length);
        return profiles;
      case "users":
        return await ctx.db.query("users").collect();
      case "sessions":
        return await ctx.db.query("sessions").collect();
      default:
        throw new Error(`Unknown table: ${args.tableName}`);
    }
  },
});
