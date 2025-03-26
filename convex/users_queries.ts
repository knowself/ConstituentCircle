import { QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";

const userRoles = v.union(
  v.literal("admin"),
  v.literal("user"),
  v.literal("representative"),
  v.literal("company_admin"),
  v.literal("constituent")
);

export const listUsers = query({
  args: {
    role: v.optional(userRoles),
    search: v.optional(v.string())
  },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      email: v.string(),
      name: v.string(),
      displayname: v.optional(v.string()),
      role: userRoles,
      authProvider: v.string(),
      metadata: v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        employmentType: v.optional(v.string())
      }),
      createdAt: v.number(),
      lastLoginAt: v.optional(v.number())
    })
  ),
  handler: async (ctx: QueryCtx, args) => {
    let query = ctx.db.query("users");

    // Apply role filter if provided
    if (args.role !== undefined) {
      query = query.filter(q => q.eq(q.field("role"), args.role));
    }

    // Get all users matching the base criteria
    const users = await query.collect();

    // If search term provided, filter in memory for case-insensitive partial matches
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      return users.filter(user => {
        const emailMatch = user.email.toLowerCase().includes(searchLower);
        const nameMatch = user.name.toLowerCase().includes(searchLower);
        const displaynameMatch = user.displayname?.toLowerCase().includes(searchLower) ?? false;
        return emailMatch || nameMatch || displaynameMatch;
      });
    }

    return users;
  }
});
