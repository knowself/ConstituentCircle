import { v, ConvexError } from "convex/values";
import { action, query, internalQuery } from "./_generated/server";
import type { AuthResponse, UserDoc } from "./types";
import { Id } from "./_generated/dataModel";

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthResponse> => {
    const normalizedEmail = args.email.toLowerCase().trim();

    // @ts-ignore // 'internal' is implicitly available at runtime
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail,
    });

    if (!user || !user._id) {
      throw new ConvexError({
        type: "authentication",
        message: "No user found with this email",
        status: 401,
      });
    }

    if (!user.email) {
      throw new ConvexError({
        type: "authentication",
        message: "User record is missing an email",
        status: 401,
      });
    }

    // @ts-ignore // 'internal' is implicitly available at runtime
    const isValid = await ctx.runAction(internal.authInternal.verifyPassword, {
      password: args.password,
      hash: user.passwordHash || "",
    });

    if (!isValid) throw new ConvexError("Invalid email or password");

    // @ts-ignore // 'internal' is implicitly available at runtime
    const token = await ctx.runAction(internal.authInternal.generateToken, {
      userId: user._id,
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    await ctx.runMutation(internal.authInternal.createSession, {
      userId: user._id,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    await ctx.runMutation(internal.authInternal.updateLastLogin, {
      userId: user._id,
    });

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name ?? user.email,
        role: user.role,
      },
    };
  },
});

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args): Promise<UserDoc | null> => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    return (await ctx.db.get(session.userId)) as UserDoc | null;
  },
});

export const signup = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    metadata: v.optional(
      v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args): Promise<AuthResponse> => {
    const normalizedEmail = args.email.toLowerCase().trim();

    // @ts-ignore // 'internal' is implicitly available at runtime
    const existingUser = (await ctx.runQuery(internal.users.getUserByEmail, {
      email: normalizedEmail,
    })) as UserDoc | null;

    if (existingUser) throw new ConvexError("User already exists");

    // @ts-ignore // 'internal' is implicitly available at runtime
    const passwordHash = await ctx.runAction(internal.authInternal.hashPassword, {
      password: args.password,
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    const userId = await ctx.runMutation(internal.users.createUser, {
      email: normalizedEmail,
      name: args.name,
      passwordHash,
      role: "user",
      authProvider: "email",
      metadata: args.metadata || {},
      createdAt: Date.now(),
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    const token = await ctx.runAction(internal.authInternal.generateToken, {
      userId,
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    await ctx.runMutation(internal.authInternal.createSession, {
      userId,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    // @ts-ignore // 'internal' is implicitly available at runtime
    const user = (await ctx.runQuery(internal.users.getUser, { userId })) as UserDoc | null;
    if (!user || !user.email) throw new ConvexError("Failed to create user");

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name ?? user.email,
        role: user.role,
      },
    };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

type CheckUserActionResult = {
  exists: boolean;
  message?: string;
  hasPasswordHash: boolean;
  role: string | null;
  id: Id<"users"> | null;
  email: string;
  name: string | null;
  createdAt: number | null;
};

export const _checkUserByEmailInternal = internalQuery({
  args: {
    email: v.string(),
  },
  returns: v.object({
    exists: v.boolean(),
    message: v.optional(v.string()),
    hasPasswordHash: v.boolean(),
    role: v.union(v.string(), v.null()),
    id: v.union(v.id("users"), v.null()),
    email: v.string(),
    name: v.union(v.string(), v.null()),
    createdAt: v.union(v.number(), v.null()),
  }),
  handler: async (ctx, args): Promise<CheckUserActionResult> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();

    if (!user) {
      return {
        exists: false,
        message: "User not found",
        hasPasswordHash: false,
        role: null,
        id: null,
        email: args.email.toLowerCase(),
        name: null,
        createdAt: null,
      };
    }

    return {
      exists: true,
      hasPasswordHash: !!user.passwordHash,
      role: user.role,
      id: user._id,
      email: user.email ?? args.email.toLowerCase(),
      name: user.name ?? null,
      createdAt: user.createdAt,
    };
  },
});

export const checkUser = action({
  args: {
    email: v.string(),
  },
  returns: v.object({
    exists: v.boolean(),
    message: v.optional(v.string()),
    hasPasswordHash: v.boolean(),
    role: v.union(v.string(), v.null()),
    id: v.union(v.id("users"), v.null()),
    email: v.string(),
    name: v.union(v.string(), v.null()),
    createdAt: v.union(v.number(), v.null()),
  }),
  handler: async (ctx, args): Promise<CheckUserActionResult> => {
    const normalizedEmail = args.email.toLowerCase();
    console.log(`Action: Checking user with email: ${normalizedEmail}`);

    try {
      // @ts-ignore // Ignore TS error, 'internal' is implicitly available at runtime
      const result = await ctx.runQuery(internal.auth._checkUserByEmailInternal, {
        email: normalizedEmail,
      });
      console.log("Action: Query result:", result);
      return result;
    } catch (error) {
      console.error("Error running internal query:", error);
      return {
        exists: false,
        message: error instanceof Error ? error.message : "An internal error occurred while checking user",
        hasPasswordHash: false,
        role: null,
        id: null,
        email: normalizedEmail,
        name: null,
        createdAt: null,
      };
    }
  },
});
