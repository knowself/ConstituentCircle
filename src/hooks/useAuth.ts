import { useAuth as useAuthContext } from "@/context/AuthProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useAuth() {
  const auth = useAuthContext();
  const convexUser = useQuery(api.users.me);
  const isLoading = auth.isLoading || convexUser === undefined;
  const user = convexUser ?? auth.user;

  return {
    ...auth,
    user,
    clerkUser: auth.user,
    convexUser: convexUser ?? null,
    isLoading,
  };
}
