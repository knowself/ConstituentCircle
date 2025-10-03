"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export default function EnsureUserOnLogin() {
  const { user, isSignedIn } = useUser();
  const ensureUser = useMutation(api.users.ensureUser);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    ensureUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName ?? user.username ?? undefined,
    }).catch((error) => {
      console.error("Failed to ensure user in Convex", error);
    });
  }, [ensureUser, isSignedIn, user]);

  return null;
}
