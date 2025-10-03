import { api } from "../../../convex/_generated/api";

export function getApi() {
  return {
    users: {
      ensureUser: api.users.ensureUser,
      me: api.users.me,
    },
  };
}

export const safeApi = getApi();
