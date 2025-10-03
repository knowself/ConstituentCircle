import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase().trim()))
      .first();
  }
});

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

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      console.log("getCurrentUser: No authenticated identity found.");
      return null;
    }

    if (!identity.email) {
      console.warn(`getCurrentUser: Authenticated identity ${identity.subject} is missing an email address.`);
      return null;
    }

    const normalizedEmail = identity.email.toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (!user) {
      console.warn(`getCurrentUser: Authenticated user with email ${normalizedEmail} not found in DB.`);
      return null;
    }

    console.log(`getCurrentUser: Found user for email ${normalizedEmail}, id: ${user._id}`);
    return user;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      name: v.optional(v.string()),
      metadata: v.optional(v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
      }))
    })
  },
  handler: async (ctx, { userId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userToUpdate = await ctx.db.get(userId);
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    if (userToUpdate.email !== identity.email) {
      throw new Error("Unauthorized to update this profile");
    }

    await ctx.db.patch(userId, updates);
  },
});

export const ensureUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedClerkId = args.clerkId.trim();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", normalizedClerkId))
      .unique();

    const email = args.email?.trim().toLowerCase() ?? existing?.email;
    if (!email) {
      throw new ConvexError({
        message: `Clerk user ${normalizedClerkId} is missing an email address`,
      });
    }

    const name = args.name?.trim() || existing?.name || email;

    if (existing) {
      const updates: Record<string, unknown> = {
        authProvider: "clerk",
        lastLoginAt: Date.now(),
      };

      if (existing.email !== email) {
        updates.email = email;
      }
      if (existing.name !== name) {
        updates.name = name;
      }
      if (!existing.displayname && name) {
        updates.displayname = name;
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existing._id, updates);
      }

      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: normalizedClerkId,
      email,
      name,
      displayname: name,
      role: "user",
      authProvider: "clerk",
      metadata: undefined,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});
