"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function DebugMePage() {
  const me = useQuery(api.users.me);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Current Convex user</h1>
      <pre className="bg-black text-green-400 text-xs p-4 rounded">{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
