import { api as generatedApi } from "../../../convex/_generated/api";
import type { FunctionReference } from "convex/server";

type AuthAPI = {
  getCurrentUser: FunctionReference<"query", {}, any>;
  login: FunctionReference<"mutation", {email: string, password: string}, Promise<void>>;
  signup: FunctionReference<"mutation", {email: string, password: string, name: string}, Promise<void>>;
  logout: FunctionReference<"mutation", {}, Promise<void>>;
  updateProfile: FunctionReference<"mutation", Partial<{name: string, email: string}>, Promise<void>>;
};

export const api = {
  ...generatedApi,
  auth: generatedApi.auth as AuthAPI
};