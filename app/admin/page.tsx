"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminHomePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold text-foreground">Admin Control Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="font-medium">{user?.email}</span>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-lg font-medium">User management</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Convex functions handle user onboarding through Clerk. Additional management tools will live here.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-lg font-medium">Next steps</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Audit Convex admin queries and rebuild the legacy dashboards when requirements are ready.
          </p>
          <Link className="mt-4 inline-flex text-sm text-primary" href="/debug/me">
            View current Convex record ?
          </Link>
        </article>
      </section>
    </div>
  );
}
