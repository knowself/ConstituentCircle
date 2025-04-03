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
import type * as admin_queries from "../admin_queries.js";
import type * as api_ from "../api.js";
import type * as auth from "../auth.js";
import type * as authInternal from "../authInternal.js";
import type * as cleanupProfiles from "../cleanupProfiles.js";
import type * as communications from "../communications.js";
import type * as constituents from "../constituents.js";
import type * as createAdminUser from "../createAdminUser.js";
import type * as diagnostics from "../diagnostics.js";
import type * as displayTables from "../displayTables.js";
import type * as fixGovernmentLevel from "../fixGovernmentLevel.js";
import type * as fixGovernmentLevelData from "../fixGovernmentLevelData.js";
import type * as fixGovernmentLevels from "../fixGovernmentLevels.js";
import type * as fixProfilesSchema from "../fixProfilesSchema.js";
import type * as http from "../http.js";
import type * as internal_ from "../internal.js";
import type * as populateRepresentatives from "../populateRepresentatives.js";
import type * as profile_diagnostics from "../profile_diagnostics.js";
import type * as regenerateProfiles from "../regenerateProfiles.js";
import type * as schema_auth from "../schema/auth.js";
import type * as setAdminPassword from "../setAdminPassword.js";
import type * as tasks from "../tasks.js";
import type * as types from "../types.js";
import type * as updateProfileGovernmentLevel from "../updateProfileGovernmentLevel.js";
import type * as users from "../users.js";
import type * as users_actions from "../users_actions.js";
import type * as users_mutations from "../users_mutations.js";
import type * as users_queries from "../users_queries.js";
import type * as validators from "../validators.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin_queries: typeof admin_queries;
  api: typeof api_;
  auth: typeof auth;
  authInternal: typeof authInternal;
  cleanupProfiles: typeof cleanupProfiles;
  communications: typeof communications;
  constituents: typeof constituents;
  createAdminUser: typeof createAdminUser;
  diagnostics: typeof diagnostics;
  displayTables: typeof displayTables;
  fixGovernmentLevel: typeof fixGovernmentLevel;
  fixGovernmentLevelData: typeof fixGovernmentLevelData;
  fixGovernmentLevels: typeof fixGovernmentLevels;
  fixProfilesSchema: typeof fixProfilesSchema;
  http: typeof http;
  internal: typeof internal_;
  populateRepresentatives: typeof populateRepresentatives;
  profile_diagnostics: typeof profile_diagnostics;
  regenerateProfiles: typeof regenerateProfiles;
  "schema/auth": typeof schema_auth;
  setAdminPassword: typeof setAdminPassword;
  tasks: typeof tasks;
  types: typeof types;
  updateProfileGovernmentLevel: typeof updateProfileGovernmentLevel;
  users: typeof users;
  users_actions: typeof users_actions;
  users_mutations: typeof users_mutations;
  users_queries: typeof users_queries;
  validators: typeof validators;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
