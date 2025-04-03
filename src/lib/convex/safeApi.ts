import { api } from "../../../convex/_generated/api";

export function getApi() {
  return {
    auth: {
      getCurrentUser: api.auth.getCurrentUser,
      login: api.auth.login,
      signup: api.auth.signup,
      logout: api.auth.logout,
      updateProfile: api.auth.updateProfile
    }
  };
}

export const safeApi = getApi();