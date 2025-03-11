import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const handleNewUser = mutation({
  args: {
    id: v.string(),
    email: v.string(),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      const { id, email, name } = args;

      // Check for existing user
      const existingUser = await ctx.db
        .query("profiles")
        .filter(q => q.eq(q.field("email"), email))
        .first();

      if (existingUser) {
        return existingUser._id;
      }

      const firstName = name ? name.split(' ')[0] : email.split('@')[0];
      const lastName = name ? name.split(' ')[1] || '' : '';
      const displayName = name || email.split('@')[0];
      const now = Date.now();

      const userId = await ctx.db.insert("profiles", {
        name: displayName,
        email,
        role: "constituent",
        displayname: displayName,
        metadata: {
          firstName,
          lastName,
          employmentType: "citizen"
        },
        created_at: new Date(now).toISOString(),
        createdAt: now,
        governmentLevel: "none",
        position: "constituent",
        jurisdiction: "unassigned",
        party: "none",
        termStart: now,
        termEnd: now + (10 * 365 * 24 * 60 * 60 * 1000), // 10 years in the future
        district: "unassigned"
      });

      return userId;
    } catch (error) {
      console.error("Error in handleNewUser:", error);
      // Line 54 error fix
      try {
        // Fix: Type check the error before accessing message property
        if (error instanceof Error) {
          throw new Error(`Failed to create new user: ${error.message}`);
        } else {
          throw new Error(`Failed to create new user: ${String(error)}`);
        }
      } catch (error) {
        // Fix: Type check the error before accessing message property
        if (error instanceof Error) {
          throw new Error(`Failed to create new user: ${error.message}`);
        } else {
          throw new Error(`Failed to create new user: ${String(error)}`);
        }
      }
    }
  }
});

export const linkCompanyAdminProfile = mutation({
  args: { 
    email: v.string(),
    displayName: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      const { email, displayName } = args;

      // Check for existing user
      const existing = await ctx.db
        .query("profiles")
        .filter(q => q.eq(q.field("email"), email))
        .first();

      if (existing) {
        return existing._id;
      }

      const displayname = displayName || email.split('@')[0];
      const firstName = displayname.split(' ')[0];
      const lastName = displayname.split(' ').length > 1 ? displayname.split(' ')[1] : '';
      const now = Date.now();
      
      const metadata = {
        firstName,
        lastName,
        employmentType: "staff"
      };
      
      const adminId = await ctx.db.insert("profiles", {
        name: displayname,
        email,
        role: "representative",
        createdAt: now,
        displayname,
        metadata,
        created_at: new Date(now).toISOString(),
        governmentLevel: "other",
        position: "staff",
        jurisdiction: "unassigned",
        party: "none",
        termStart: now,
        termEnd: now + (365 * 24 * 60 * 60 * 1000), // 1 year
        district: "unassigned"
      });

      return adminId;
    } catch (error) {
      console.error("Error in linkCompanyAdminProfile:", error);
      // Line 109 error fix
      try {
        // Fix: Type check the error before accessing message property
        if (error instanceof Error) {
          throw new Error(`Failed to create admin profile: ${error.message}`);
        } else {
          throw new Error(`Failed to create admin profile: ${String(error)}`);
        }
      } catch (error) {
        // Fix: Type check the error before accessing message property
        if (error instanceof Error) {
          throw new Error(`Failed to create admin profile: ${error.message}`);
        } else {
          throw new Error(`Failed to create admin profile: ${String(error)}`);
        }
      }
    }
  }
});