// Fix the import path - need to go up one directory level
import { query } from "./_generated/server";

export const get = query({
  args: {},
  // Add type annotation for ctx:
  handler: async (ctx: any) => {
    return await ctx.db.query("tasks").collect();
  },
});