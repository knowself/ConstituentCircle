import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

// Common context types
export type ActionCtx = GenericActionCtx<DataModel>;
export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;

// User-related types
export type UserRole = "admin" | "user" | "representative";
export type AuthProvider = "email" | "oauth";

export interface UserDoc {
  _id: Id<"users">;
  email: string;
  name: string;
  passwordHash?: string;
  role: UserRole;
  authProvider: AuthProvider;
  metadata: {
    firstName?: string;
    lastName?: string;
  };
  createdAt: number;
  lastLoginAt?: number;
}

// Profile-related types
export type GovernmentLevel = "federal" | "state" | "county" | "municipal" | "other";

export interface ProfileDoc {
  _id: Id<"profiles">;
  email: string;
  displayname: string;
  governmentLevel: GovernmentLevel;
  jurisdiction: string;
  district?: string;
  party?: string;
  position?: string;
  termStart?: number;
  termEnd?: number;
  role?: string;
  metadata: {
    firstName: string;
    lastName: string;
    employmentType?: string;
  };
  createdAt: number;
  userId?: Id<"users">;
}

// Auth-related types
export interface AuthResponse {
  token: string;
  user: {
    _id: Id<"users">;
    email: string;
    name: string;
    role: UserRole;
  };
}
