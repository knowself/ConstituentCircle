import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

// New query to get the currently authenticated user's data
export const getCurrentUser = query({
  args: {}, // No arguments needed
  handler: async (ctx) => {
    // Get the identity of the user calling this query, if authenticated
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, identity will be null
    if (!identity) {
      console.log("getCurrentUser: No authenticated identity found.");
      return null;
    }

    // Explicitly check if email exists on the identity
    if (!identity.email) {
      console.warn(`getCurrentUser: Authenticated identity ${identity.subject} is missing an email address.`);
      return null; // Cannot find user without email if that's the key
    }

    // Assign to a new const after the check to ensure type narrowing
    const userEmail = identity.email;

    // Now TypeScript knows userEmail is a string
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail)) // Use the email from the identity
      .first(); // Use first() as email should be unique

    if (!user) {
      // This case should ideally not happen if signup correctly creates a user
      // record linked to the auth identity, but handle it defensively.
      console.warn(`getCurrentUser: Authenticated user with email ${userEmail} not found in DB.`);
      return null;
    }
    
    console.log(`getCurrentUser: Found user for email ${userEmail}, id: ${user._id}`);
    return user; // Return the full user document
  },
});

// Add updateUserProfile mutation if it doesn't exist already
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"), // Ensure you pass the user's ID
    updates: v.object({ // Define the fields that can be updated
      name: v.optional(v.string()),
      // Add other updatable fields here, e.g., metadata
      metadata: v.optional(v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        // Add other metadata fields as needed
      }))
    })
  },
  handler: async (ctx, { userId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Optional: Check if the authenticated user is the one they are trying to update
    // (or if they have admin privileges)
    const userToUpdate = await ctx.db.get(userId);
    if (!userToUpdate) {
      throw new Error("User not found");
    }
    // Example check: allow self-update or admin update
    if (userToUpdate.email !== identity.email /* && !isAdmin(identity) */) {
       throw new Error("Unauthorized to update this profile");
    }


    console.log(`Updating profile for user ${userId} with updates:`, updates);
    await ctx.db.patch(userId, updates);
    console.log(`Profile updated for user ${userId}`);
    // Optionally return the updated user or just void
    // return await ctx.db.get(userId);
  },
});
