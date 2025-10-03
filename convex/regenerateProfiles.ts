import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const regenerateProfiles = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let createdCount = 0;

    for (const user of users) {
      if (!user.email) {
        console.warn(`Skipping profile regeneration for user ${user._id} without email`);
        continue;
      }

      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (existingProfile) {
        continue;
      }

      const name = user.name || user.email;
      const displayname = user.displayname || name;

      await ctx.db.insert("profiles", {
        userId: user._id,
        email: user.email,
        name,
        role: user.role,
        governmentLevel: "federal",
        jurisdiction: "state",
        district: "default",
        displayname,
        createdAt: Date.now(),
        metadata: {
          firstName: user.metadata?.firstName || "",
          lastName: user.metadata?.lastName || "",
          employmentType: user.metadata?.employmentType || "permanent",
        },
      });

      createdCount++;
    }

    return createdCount;
  },
});
