import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const handleNewUser = mutation({
  args: {
    id: v.string(),
    email: v.string(),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, email, name } = args;

    // Split name into first and last name
    const firstName = name ? name.split(' ')[0] : email.split('@')[0];
    const lastName = name ? name.split(' ')[1] || '' : '';

    // Create profile
    await ctx.db.insert("profiles", {
      email,
      role: "constituent",
      displayname: name || email.split('@')[0],
      metadata: {
        firstName,
        lastName,
        employmentType: "citizen"
      },
      created_at: new Date().toISOString()
    });
  }
});

export const linkCompanyAdminProfile = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Check if profile exists
    const existing = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("id"), userId))
      .first();

    if (!existing) {
      await ctx.db.insert("profiles", {
        email: "joe@derivativegenius.com",
        role: "company_admin",
        displayname: "Joe Terry",
        metadata: {
          firstName: "Joe",
          lastName: "Terry",
          employmentType: "permanent"
        },
        created_at: new Date().toISOString()
      });
    }
  }
});