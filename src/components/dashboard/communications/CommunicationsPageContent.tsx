"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function CommunicationsPageContent() {
  const { user } = useAuth();

  const placeholder = useMemo(
    () => [
      { label: "Total communications", value: "—" },
      { label: "Active conversations", value: "—" },
      { label: "Responses waiting", value: "—" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track outreach and responses once the Convex workflows are wired up.
          </p>
        </div>
        <p className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
          Signed in as {user?.email ?? "unknown user"}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {placeholder.map((item) => (
          <article key={item.label} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-lg font-medium">Next steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Define Convex queries for conversations and engagement metrics.</li>
          <li>Wire in the composer flow to trigger Convex actions.</li>
          <li>Add filters (status, channel, district) once data is available.</li>
        </ol>
      </section>
    </div>
  );
}
