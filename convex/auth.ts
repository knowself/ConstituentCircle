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
      district: "unassigned"
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
      hash: user.passwordHash!,
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
      role: user.role || user.metadata?.role
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