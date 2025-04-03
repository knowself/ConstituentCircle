import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getByRepresentative = query({
  args: { 
    representativeId: v.union(v.id("users"), v.literal("skip"))
  },
  handler: async (ctx, args) => {
    if (args.representativeId === "skip") return [];
    return await ctx.db
      .query("communications")
      .withIndex("by_representative", q =>
        q.eq("representativeId", args.representativeId as Id<"users">)
      )
      .collect();
  }
});

export const createCommunication = mutation({
  args: {
    representativeId: v.id("users"),
    constituentId: v.id("users"),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("communications", {
      ...args,
      status: "pending",
      createdAt: Date.now()
    });
  }
});

export const getCommunication = query({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.communicationId);
  }
});

export const updateCommunication = mutation({
  args: {
    communicationId: v.id("communications"),
    updates: v.object({
      status: v.optional(v.union(
        v.literal("pending"),
        v.literal("sent"),
        v.literal("delivered"),
        v.literal("read")
      )),
      analytics: v.optional(v.object({
        engagement: v.object({
          likes: v.number(),
          shares: v.number(),
          comments: v.number(),
          reach: v.number()
        })
      }))
    })
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.communicationId, {
      ...args.updates,
      updatedAt: Date.now()
    });
  }
});
