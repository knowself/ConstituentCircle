"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { randomBytes, createHash } from "crypto";

// Helper action for password hashing
export const hashPassword = internalAction({
  args: { password: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    // Implementation of password hashing using Node's crypto
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256')
      .update(args.password + salt)
      .digest('hex');
    return `${salt}:${hash}`;
  },
});

// Helper action for token generation
export const generateToken = internalAction({
  args: {},
  returns: v.string(),
  handler: async (ctx, args) => {
    // Generate a random token using Node's crypto
    return randomBytes(32).toString('hex');
  },
});

// Helper action for password verification
export const verifyPassword = internalAction({
  args: { password: v.string(), hash: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // In a real implementation, verify the password hash
    const [salt, storedHash] = args.hash.split(':');
    
    // If the hash doesn't have the expected format, return false
    if (!salt || !storedHash) {
      return false;
    }
    
    const calculatedHash = createHash('sha256')
      .update(args.password + salt)
      .digest('hex');
      
    return calculatedHash === storedHash;
  },
});