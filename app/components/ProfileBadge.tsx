"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function ProfileBadge() {
  const { isLoaded, isSignedIn, user } = useUser();
  const me = useQuery(api.users.me);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="text-sm">
      <SignedIn>
        <span className="mr-2">Hello {me?.name ?? user?.firstName ?? "there"}!</span>
        <Link href="/debug/me" className="underline text-xs">
          debug me
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>
    </div>
  );
}
