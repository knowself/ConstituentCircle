import { query } from "./_generated/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";

export const displayTables = query({
  args: {
    tableName: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db.query(args.tableName as keyof DataModel)
    return data;
  },
});
