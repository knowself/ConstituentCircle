"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading admin workspace…
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center text-foreground">
        <p className="max-w-md text-sm text-muted-foreground">
          You need an administrator account to access this area. Please sign in with admin credentials or return to the public site.
        </p>
        <div className="flex gap-3">
          <Link className="rounded-md border px-4 py-2 text-sm" href="/">
            Back to home
          </Link>
          <Link className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground" href="/auth/signin">
            Admin sign in
          </Link>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
