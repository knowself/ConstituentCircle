import { api } from "../../../convex/_generated/api";
import type { FunctionReference } from "convex/server";

export function getApi() {
  return {
    auth: {
      getCurrentUser: api.auth.getCurrentUser as FunctionReference<"query", {}, any>,
      login: api.auth.login as FunctionReference<"mutation", {email: string, password: string}, Promise<void>>,
      signup: api.auth.signup as FunctionReference<"mutation", {email: string, password: string, name: string}, Promise<void>>,
      logout: api.auth.logout as FunctionReference<"mutation", {}, Promise<void>>,
      updateProfile: api.auth.updateProfile as FunctionReference<"mutation", Partial<{name: string, email: string}>, Promise<void>>
    }
  };
}

export const safeApi = getApi();