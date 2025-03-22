import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export interface User {
  _id: string;
  email: string;
  role: string;
  name?: string;
}

export function useAuth() {
  const user = useQuery(api.auth.getCurrentUser, {});
  const isLoading = user === undefined;

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !isLoading && user !== null
  };
}
