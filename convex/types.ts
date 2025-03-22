import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

// Define extended context types with schema-specific database access
export type ActionCtxWithAuth = GenericActionCtx<DataModel>;
export type QueryCtxWithAuth = GenericQueryCtx<DataModel>;
export type MutationCtxWithAuth = GenericMutationCtx<DataModel>;

// Define interface for internal auth actions/mutations with specific types
export interface InternalAuthActions {
  createSession: {
    args: {
      userId: Id<"users">;
      token: string;
      expiresAt: number;
      createdAt: number;
    };
    returns: void; // or v.id("sessions") if you want to return the session ID
  };
  updateLastLogin: {
    args: {
      userId: Id<"users">;
    };
    returns: void;
  };
  updatePassword: {
    args: {
      userId: Id<"users">;
      passwordHash: string;
    };
    returns: void;
  };
  hashPassword: {
    args: {
      password: string;
    };
    returns: string;
  };
  verifyPassword: {
    args: {
      password: string;
      hash: string;
    };
    returns: boolean;
  };
  generateToken: {
    args: Record<string, never>; // Empty object for no args
    returns: string;
  };
}