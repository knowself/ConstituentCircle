// This file re-exports the generated API to maintain compatibility
// with existing imports in the codebase
export { api } from "./_generated/api";

// Import and re-export modules to ensure they're included in the bundle
import * as auth from "./auth";
import * as users_queries from "./users_queries";
import * as users_mutations from "./users_mutations";
import * as users_actions from "./users_actions";
import * as admin_queries from "./admin_queries";

export { auth, users_queries, users_mutations, users_actions, admin_queries };