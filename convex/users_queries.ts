import { QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

const userRoles = v.union(
  v.literal("admin"),
  v.literal("user"),
  v.literal("representative"),
  v.literal("company_admin"),
  v.literal("constituent")
);

const toResponse = (user: Doc<"users">) => ({
  _id: user._id,
  _creationTime: user._creationTime,
  email: user.email ?? "",
  name: user.name ?? user.email ?? "",
  displayname: user.displayname ?? undefined,
  role: user.role,
  authProvider: user.authProvider ?? "clerk",
  metadata: {
    firstName: user.metadata?.firstName,
    lastName: user.metadata?.lastName,
    employmentType: user.metadata?.employmentType,
  },
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

export const listUsers = query({
  args: {
    role: v.optional(userRoles),
    search: v.optional(v.string()),
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
        employmentType: v.optional(v.string()),
      }),
      createdAt: v.number(),
      lastLoginAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx: QueryCtx, args) => {
    let queryBuilder = ctx.db.query("users");

    if (args.role !== undefined) {
      queryBuilder = queryBuilder.filter((q) => q.eq(q.field("role"), args.role));
    }

    const docs = await queryBuilder.collect();
    const users = docs.map(toResponse);

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      return users.filter((user) => {
        const emailMatch = user.email.toLowerCase().includes(searchLower);
        const nameMatch = user.name.toLowerCase().includes(searchLower);
        const displaynameMatch = user.displayname?.toLowerCase().includes(searchLower) ?? false;
        return emailMatch || nameMatch || displaynameMatch;
      });
    }

    return users;
  },
});
