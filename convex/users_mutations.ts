import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
const userRoles = v.union(
  v.literal("admin"),
  v.literal("user"),
  v.literal("representative"),
  v.literal("company_admin"),
  v.literal("constituent")
);

export const createUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: userRoles,
    authProvider: v.union(v.literal("email"), v.literal("oauth")),
    metadata: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string())
    }),
    createdAt: v.number(),
    displayname: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      email: args.email.toLowerCase(),
      role: args.role || "user",
      name: args.name || args.email,
      authProvider: "email",
      metadata: {
        firstName: "",
        lastName: "",
        employmentType: undefined
      },
      createdAt: Date.now()
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    metadata: v.optional(v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.metadata !== undefined) updates.metadata = args.metadata;

    await ctx.db.patch(args.userId, updates);
    return true;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("representative"))
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return true;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    // Delete associated sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete the user
    await ctx.db.delete(args.userId);
    return true;
  },
});
