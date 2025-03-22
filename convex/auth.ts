// convex/auth.ts
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api, internal as internalFunctions } from "./_generated/api";
import { ConvexError } from "convex/values";
import { isValidGovernmentLevel, isValidJurisdiction, normalizeGovernmentLevel, normalizeJurisdiction } from "./validators";
import { Role } from "../lib/types/roles";

// Define employmentTypes to match schema.ts
const employmentTypes = v.union(
  v.literal("permanent"),
  v.literal("seasonal"),
  v.literal("intern"),
  v.literal("onloan"),
  v.literal("elected"),
  v.literal("citizen"),
  v.literal("campaign_manager"),
  v.literal("volunteer_coordinator"),
  v.literal("communications_director"),
  v.literal("field_director"),
  v.literal("fundraising_director")
);

// Define return types for clarity
type UserResponse = {
  _id: Id<"users">;
  email: string;
  displayname?: string;
  role: Role;
  name: string;
};

type AuthResponse = {
  token: string;
  user: UserResponse;
};

// Define user document type to match schema
interface UserDoc {
  _id: Id<"users">;
  email?: string;
  displayname?: string;
  role?: string;
  name?: string;
  passwordHash?: string;
  authProvider?: string;
  metadata?: {
    firstName?: string;
    lastName?: string;
    employmentType?: "permanent" | "seasonal" | "intern" | "onloan" | "elected" | "citizen" | "campaign_manager" | "volunteer_coordinator" | "communications_director" | "field_director" | "fundraising_director";
  };
  createdAt?: number;
  lastLoginAt?: number;
}

// Action wrappers for password operations
export const verifyPasswordAction = action({
  args: { email: v.string(), password: v.string() },
  returns: v.object({
    isValid: v.boolean(),
    userId: v.union(v.id("users"), v.null()),
  }),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const user = await ctx.runQuery(api.auth.getUserByEmail, { email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return { isValid: false, userId: null };
    }
    const isValid = await ctx.runAction(internalFunctions.authInternal.verifyPassword, {
      password: args.password,
      hash: user.passwordHash,
    });
    return { isValid, userId: user._id };
  },
});

export const hashPasswordAction = action({
  args: { password: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    return await ctx.runAction(internalFunctions.authInternal.hashPassword, { password: args.password });
  },
});

// Helper query for email lookup
export const getUserByEmail = query({
  args: { email: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
      passwordHash: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();
    return user
      ? {
          _id: user._id,
          email: user.email ?? "",
          passwordHash: user.passwordHash ?? "",
          displayname: user.displayname,
          role: user.role || "user",
          name: user.name || user.email?.split("@")[0] || "",
        }
      : null;
  },
});

// Logout a user
export const logout = mutation({
  args: { token: v.string() },
  returns: v.object({ success: v.boolean(), message: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
      return { success: true, message: "Logged out" };
    }
    return { success: true, message: "No active session found" };
  },
});

// Login with email and password
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  returns: v.object({
    token: v.string(),
    user: v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const { isValid, userId } = await (ctx as any).runAction(api.auth.verifyPasswordAction, {
      email: args.email,
      password: args.password,
    });

    if (!isValid || !userId) throw new ConvexError("Invalid email or password");

    const user = (await ctx.db.get(userId)) as UserDoc | null;
    if (!user) throw new ConvexError("User not found");

    const sessionToken = await ctx.runMutation(internalFunctions.authInternal.generateToken, {});
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.runMutation(internalFunctions.authInternal.createSession, {
      userId: user._id,
      token: sessionToken,
      expiresAt,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internalFunctions.authInternal.updateLastLogin, { userId: user._id });

    return {
      token: sessionToken,
      user: {
        _id: user._id,
        email: user.email ?? "",
        displayname: user.displayname,
        role: user.role || "user",
        name: user.name || user.email?.split("@")[0] || "",
      },
    };
  },
});

// Get current user information
export const getCurrentUser = query({
  args: { token: v.optional(v.string()) },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && !args.token) return null;

    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token as string))
        .first();
      if (!session || session.expiresAt < Date.now()) return null;
      const user = (await ctx.db.get(session.userId)) as UserDoc | null;
      return user
        ? {
            _id: user._id,
            email: user.email ?? "",
            displayname: user.displayname,
            role: user.role || "user",
            name: user.name || user.email?.split("@")[0] || "",
          }
        : null;
    }

    const user = (await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity?.email!))
      .first()) as UserDoc | null;
    return user
      ? {
          _id: user._id,
          email: user.email ?? "",
          displayname: user.displayname,
          role: user.role || "user",
          name: user.name || user.email?.split("@")[0] || "",
        }
      : null;
  },
});

// Validate a session token
export const validateSession = query({
  args: { token: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = (await ctx.db.get(session.userId)) as UserDoc | null;
    return user
      ? {
          _id: user._id,
          email: user.email ?? "",
          displayname: user.displayname,
          role: user.role || "user",
          name: user.name || user.email?.split("@")[0] || "",
        }
      : null;
  },
});

// Clean up expired sessions
export const cleanupExpiredSessions = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("sessions")
      .filter((q) => q.lt(q.field("expiresAt"), now as any))
      .collect();
    await Promise.all(expired.map((s) => ctx.db.delete(s._id)));
    return expired.length;
  },
});

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    governmentLevel: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
  },
  returns: v.object({
    token: v.string(),
    user: v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existingUser) throw new ConvexError("User already exists");

    const passwordHash = await (ctx as any).runAction(api.auth.hashPasswordAction, { password: args.password });
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      passwordHash,
      authProvider: "email",
      metadata: { firstName: args.firstName, lastName: args.lastName },
      role: "constituent",
      name: args.firstName || normalizedEmail.split("@")[0],
      createdAt: Date.now(),
    });
    const user = (await ctx.db.get(userId)) as UserDoc | null;

    const token = await ctx.runMutation(internalFunctions.authInternal.generateToken, {});
    await ctx.runMutation(internalFunctions.authInternal.createSession, {
      userId,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: Date.now(),
    });

    return {
      token,
      user: {
        _id: userId,
        email: normalizedEmail,
        displayname: user?.displayname,
        role: "constituent",
        name: user?.name ?? "",
      },
    };
  },
});

// Update user information
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    email: v.optional(v.string()),
    displayname: v.optional(v.string()),
    role: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const updates: Record<string, any> = {};
    if (args.email) updates.email = args.email.toLowerCase().trim();
    if (args.displayname) updates.displayname = args.displayname;
    if (args.role) updates.role = args.role;
    if (args.name) updates.name = args.name;
    await ctx.db.patch(args.userId, updates);
    return { success: true };
  },
});

// Update user password
export const updatePassword = mutation({
  args: { userId: v.id("users"), currentPassword: v.string(), newPassword: v.string() },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const user = (await ctx.db.get(args.userId)) as UserDoc | null;
    if (!user || !user.passwordHash) throw new ConvexError("User not found or no password set");

    const { isValid } = await (ctx as any).runAction(api.auth.verifyPasswordAction, {
      email: user.email ?? "",
      password: args.currentPassword,
    });
    if (!isValid) throw new ConvexError("Current password is incorrect");

    const newHash = await (ctx as any).runAction(api.auth.hashPasswordAction, { password: args.newPassword });
    await ctx.runMutation(internalFunctions.authInternal.updatePassword, {
      userId: args.userId,
      passwordHash: newHash,
    });
    return { success: true };
  },
});

// Update user role
export const updateUserRole = mutation({
  args: { userId: v.id("users"), role: v.string() },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
    return { success: true };
  },
});

// Register a new user with email and password
export const registerWithEmail = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  returns: v.object({
    token: v.string(),
    user: v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existingUser) throw new ConvexError("User already exists");

    const passwordHash = await (ctx as any).runAction(api.auth.hashPasswordAction, { password: args.password });
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      passwordHash,
      authProvider: "email",
      metadata: { firstName: args.firstName, lastName: args.lastName },
      role: "constituent",
      name: args.firstName || normalizedEmail.split("@")[0],
      createdAt: Date.now(),
    });
    const user = (await ctx.db.get(userId)) as UserDoc | null;

    const token = await ctx.runMutation(internalFunctions.authInternal.generateToken, {});
    await ctx.runMutation(internalFunctions.authInternal.createSession, {
      userId,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      createdAt: Date.now(),
    });

    return {
      token,
      user: {
        _id: userId,
        email: normalizedEmail,
        displayname: user?.displayname,
        role: "constituent",
        name: user?.name ?? "",
      },
    };
  },
});

// Register a new user with additional information and create profile
export const registerUserWithAdditionalInfo = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    governmentLevel: v.optional(v.string()),
    jurisdiction: v.optional(v.string()),
  },
  returns: v.object({
    token: v.string(),
    user: v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existingUser) throw new ConvexError("User already exists");

    if (args.governmentLevel && args.jurisdiction) {
      const level = normalizeGovernmentLevel(args.governmentLevel);
      const juris = normalizeJurisdiction(args.jurisdiction);
      if (!isValidGovernmentLevel(level)) throw new ConvexError(`Invalid government level: ${args.governmentLevel}`);
      if (!isValidJurisdiction(juris)) throw new ConvexError(`Invalid jurisdiction: ${args.jurisdiction}`);
    }

    const passwordHash = await (ctx as any).runAction(api.auth.hashPasswordAction, { password: args.password });
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      passwordHash,
      authProvider: "email",
      metadata: { firstName: args.firstName, lastName: args.lastName },
      role: "constituent",
      name: args.firstName || normalizedEmail.split("@")[0],
      createdAt: Date.now(),
    });
    const user = (await ctx.db.get(userId)) as UserDoc | null;

    if (args.governmentLevel && args.jurisdiction && args.firstName && args.lastName) {
      await ctx.db.insert("profiles", {
        email: normalizedEmail,
        displayname: `${args.firstName} ${args.lastName}`,
        governmentLevel: args.governmentLevel,
        jurisdiction: args.jurisdiction,
        metadata: { firstName: args.firstName, lastName: args.lastName },
        createdAt: Date.now(),
        userId,
      });
    }

    const token = await ctx.runMutation(internalFunctions.authInternal.generateToken, {});
    await ctx.runMutation(internalFunctions.authInternal.createSession, {
      userId,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      createdAt: Date.now(),
    });

    return {
      token,
      user: {
        _id: userId,
        email: normalizedEmail,
        displayname: user?.displayname,
        role: "constituent",
        name: user?.name ?? "",
      },
    };
  },
});

// Set admin password
export const setAdminPassword = mutation({
  args: { password: v.string(), email: v.string() },
  returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const adminUser = (await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first()) as UserDoc | null;
    if (!adminUser) return { success: false, error: "Admin user not found" };

    const passwordHash = await (ctx as any).runAction(api.auth.hashPasswordAction, { password: args.password });
    await ctx.runMutation(internalFunctions.authInternal.updatePassword, {
      userId: adminUser._id,
      passwordHash,
    });
    return { success: true };
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const user = (await ctx.db.get(args.userId)) as UserDoc | null;
    return user
      ? {
          _id: user._id,
          email: user.email ?? "",
          displayname: user.displayname,
          role: user.role || "user",
          name: user.name || user.email?.split("@")[0] || "",
        }
      : null;
  },
});

// Check if user is admin
export const isAdmin = query({
  args: { userId: v.id("users") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = (await ctx.db.get(args.userId)) as UserDoc | null;
    return user?.role === "admin" || false;
  },
});

// Get user profile
export const getProfile = query({
  args: { userId: v.id("users") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
      displayname: v.optional(v.string()),
      role: v.string(),
      name: v.string(),
      metadata: v.optional(
        v.object({
          firstName: v.optional(v.string()),
          lastName: v.optional(v.string()),
          employmentType: v.optional(employmentTypes),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    const user = (await ctx.db.get(args.userId)) as UserDoc | null;
    return user
      ? {
          _id: user._id,
          email: user.email ?? "",
          displayname: user.displayname,
          role: user.role || "user",
          name: user.name || user.email?.split("@")[0] || "",
          metadata: user.metadata ? {
            firstName: user.metadata.firstName,
            lastName: user.metadata.lastName,
            employmentType: user.metadata.employmentType,
          } : undefined,
        }
      : null;
  },
});