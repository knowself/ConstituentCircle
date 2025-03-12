/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as auth_utils from "../auth_utils.js";
import type * as cleanupProfiles from "../cleanupProfiles.js";
import type * as regenerateProfiles from "../regenerateProfiles.js";
import type * as schema_auth from "../schema/auth.js";
import type * as scripts_populateRepresentatives from "../scripts/populateRepresentatives.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  auth_utils: typeof auth_utils;
  cleanupProfiles: typeof cleanupProfiles;
  regenerateProfiles: typeof regenerateProfiles;
  "schema/auth": typeof schema_auth;
  "scripts/populateRepresentatives": typeof scripts_populateRepresentatives;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
