import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("user"),
      v.literal("representative"),
      v.literal("company_admin"),
      v.literal("constituent")
    ),
    passwordHash: v.string(),
    metadata: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string())
    })
  },
  handler: async (ctx, input): Promise<Id<"users">> => {
    const userData = {
      email: input.email,
      name: input.name,
      role: input.role,
      passwordHash: input.passwordHash,
      authProvider: "email",
      metadata: input.metadata,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };
    return await ctx.db.insert("users", userData);
  }
});
