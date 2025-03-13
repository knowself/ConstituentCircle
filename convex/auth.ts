import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define return types for clarity
type UserResponse = {
  id: Id<"users">;
  email: string;
  name: string;
  role?: string;
};

type AuthResponse = {
  token: string;
  user: UserResponse;
};

// Helper action for password hashing
export const hashPassword = action({
  args: { password: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    // Implementation of password hashing
    // This would use a proper hashing library in production
    return `hashed_${args.password}`;
  },
});

// Helper action for token generation
export const generateToken = action({
  args: {},
  returns: v.string(),
  handler: async (ctx, args) => {
    // Generate a random token
    return Math.random().toString(36).substring(2, 15);
  },
});

// Helper action for password verification
export const verifyPassword = action({
  args: { password: v.string(), hash: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // In a real implementation, this would use a proper password verification
    return `hashed_${args.password}` === args.hash;
  },
});

// Fix the function calls to use runAfter instead of runAction and correct the internal path

// Email/Password Registration
export const registerWithEmail = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.object({
    token: v.string(),
    user: v.object({
      id: v.id("users"),
      email: v.string(),
      name: v.string(),
      role: v.optional(v.string()),
    }),
  }),
  handler: async (ctx, args): Promise<AuthResponse> => {
    const { email, password, name } = args;
    
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
      
    if (existing) {
      throw new ConvexError("Email already registered");
    }
    
    // First run the action to hash the password
    const passwordHash: string = await ctx.scheduler.runAfter(0, internal.auth_utils.hashPassword, {
      password
    });
    
    // Create user
    const userId: Id<"users"> = await ctx.db.insert("users", {
      email,
      name,
      passwordHash,
      authProvider: "email",
      role: "constituent", // Default role
      metadata: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        employmentType: "citizen",
        role: "constituent"
      },
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
    
    // Generate session token using scheduler
    const token: string = await ctx.scheduler.runAfter(0, internal.auth_utils.generateToken, {});
    
    // Store session
    await ctx.db.insert("sessions", {
      userId,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    });
    
    // Also create a profile for backward compatibility
    await ctx.db.insert("profiles", {
      email,
      name,
      role: "constituent",
      displayname: name,
      metadata: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        employmentType: "citizen",
        role: "constituent"
      },
      createdAt: Date.now(),
      governmentLevel: "none",
      position: "constituent",
      jurisdiction: "unassigned",
      party: "none",
      termStart: Date.now(),
      termEnd: Date.now() + (10 * 365 * 24 * 60 * 60 * 1000),
      district: "unassigned",
      userId
    });
    
    return {
      token,
      user: {
        id: userId,
        email,
        name,
        role: "constituent"
      },
    };
  },
});

// Email/Password Login
export const loginWithEmail = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.object({
    token: v.string(),
    user: v.object({
      id: v.id("users"),
      email: v.string(),
      name: v.string(),
      role: v.optional(v.string()),
    }),
  }),
  handler: async (ctx, args): Promise<AuthResponse> => {
    const { email, password } = args;
    
    // Find user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
      
    if (!user) {
      throw new ConvexError("Invalid credentials");
    }
    
    // Verify password using scheduler
    const isValid = await ctx.scheduler.runAfter(0, internal.auth_utils.verifyPassword, {
      password,
      hash: user.passwordHash || "",
    });
    
    if (!isValid) {
      throw new ConvexError("Invalid credentials");
    }
    
    // Generate session token
    const token: string = await ctx.scheduler.runAfter(0, internal.auth_utils.generateToken, {});
    
    // Store session
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    });
    
    // Update last login time
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    };
  },
});

// Verify session token
export const verifySession = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      userId: v.id("users"),
      email: v.string(),
      name: v.string(),
      role: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Check if token is provided
    if (!args.token) {
      return null;
    }
    
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
      
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }
    
    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  },
});

// Profile-based authentication (for backward compatibility)
export const verifyProfileSession = query({
  args: {
    token: v.string(),
    email: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      userId: v.id("profiles"),
      email: v.string(),
      name: v.string(),
      role: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Use the email passed as an argument
    if (!args.email) return null;
    
    const user = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
      
    if (!user) {
      return null;
    }
    
    return {
      userId: user._id,
      email: user.email,
      name: user.name || user.displayname || user.email.split('@')[0],
      role: user.role || (user.metadata ? user.metadata.role : undefined)
    };
  },
});

// Registration function that works with profiles
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.id("profiles")),
    role: v.optional(v.string()),
    message: v.optional(v.string())
  }),
  handler: async (ctx, args) => {
    const { email, password, name } = args;
    
    // Check if user exists
    const existing = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("email"), email))
      .first();
      
    if (existing) {
      return {
        success: false,
        message: "Email already registered"
      };
    }
    
    // Create user in profiles table
    const now = Date.now();
    const userId = await ctx.db.insert("profiles", {
      email,
      name,
      role: "constituent",
      displayname: name,
      metadata: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        employmentType: "citizen",
        password: password, // Note: In production, you should hash this password
        role: "constituent"
      },
      createdAt: now,
      governmentLevel: "none",
      position: "constituent",
      jurisdiction: "unassigned",
      party: "none",
      termStart: now,
      termEnd: now + (10 * 365 * 24 * 60 * 60 * 1000),
      district: "unassigned"
    });
    
    return {
      success: true,
      userId,
      role: "constituent"
    };
  },
});

// Get the currently authenticated user
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      email: v.string(),
      role: v.optional(v.string())
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    
    if (!user) return null;
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || (user.metadata ? user.metadata.role : undefined)
    };
  },
});

// Login a user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    token: v.optional(v.string())
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.id("users")),
    role: v.optional(v.string()),
    message: v.optional(v.string())
  }),
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    if (!user || !user.passwordHash) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
    
    // In a real implementation, you would validate the password
    // For example: if (!await bcrypt.compare(args.password, user.passwordHash))
    
    // If token is provided, validate it
    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", (q) => q.eq("token", args.token || ""))
        .unique();
      
      if (!session || session.expiresAt < Date.now()) {
        return {
          success: false,
          message: "Invalid or expired token"
        };
      }
    }
    
    // Create a new session
    const token = Math.random().toString(36).substring(2, 15);
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt
    });
    
    // Update user's last login time
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    
    return {
      success: true,
      userId: user._id,
      role: user.role || (user.metadata ? user.metadata.role : undefined)
    };
  },
});

// Logout a user
export const logout = mutation({
  args: {
    token: v.optional(v.string())
  },
  returns: v.object({
    success: v.boolean()
  }),
  handler: async (ctx, args) => {
    if (!args.token) {
      return { success: true };
    }
    
    // Find the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token || ""))
      .unique();
    
    if (session) {
      // Delete the session
      await ctx.db.delete(session._id);
    }
    
    return { success: true };
  },
});

// Get user profile
export const getProfile = query({
  args: {
    userId: v.id("users")
  },
  returns: v.union(
    v.object({
      userId: v.id("users"),
      name: v.string(),
      email: v.string(),
      role: v.optional(v.string())
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    // Find the profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    
    return {
      userId: args.userId,
      name: user.name || user.displayname || user.email.split('@')[0],
      email: user.email,
      role: user.role || (user.metadata ? user.metadata.role : undefined)
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    // Add other fields as needed
  },
  returns: v.object({
    success: v.boolean(),
    message: v.optional(v.string())
  }),
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    
    // Update the user
    const updates: any = {};
    if (args.name) updates.name = args.name;
    if (args.email) updates.email = args.email;
    
    await ctx.db.patch(args.userId, updates);
    
    // Find and update the profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (profile) {
      const profileUpdates: any = {};
      if (args.name) profileUpdates.name = args.name;
      if (args.email) profileUpdates.email = args.email;
      
      await ctx.db.patch(profile._id, profileUpdates);
    }
    
    return { success: true };
  },
});

// Register a new user - renamed to createUser to avoid duplicate declaration
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    userId: v.optional(v.id("users")),
    role: v.optional(v.string()),
    message: v.optional(v.string())
  }),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use"
      };
    }
    
    // In a real implementation, you would hash the password
    // For example: const passwordHash = await bcrypt.hash(args.password, 10);
    const passwordHash = args.password; // This is just a placeholder
    
    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: `email:${args.email}`,
      passwordHash,
      role: "user",
      displayname: args.name
    });
    
    // Create a profile for the user
    await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      email: args.email,
      role: "user",
      displayname: args.name
    });
    
    return {
      success: true,
      userId,
      role: "user"
    };
  },
});