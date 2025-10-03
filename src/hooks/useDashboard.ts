import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { Communication } from "@root/lib/types/communication";
import { Analytics } from "@root/lib/types/analytics";

interface DashboardData {
  communications: Communication[];
  analytics: Analytics[];
  loading: boolean;
  error: string | null;
}

interface UseDashboardOptions {
  communicationLimit?: number;
}

export function useDashboard({ communicationLimit = 5 }: UseDashboardOptions = {}): DashboardData {
  const { user, isLoading: authLoading } = useAuth();

  const communications = useQuery(api.communications.getByRepresentative, {
    representativeId: user?._id ?? "skip",
  });

  const mappedCommunications = useMemo<Communication[]>(() => {
    if (!communications) return [];
    return communications.slice(0, communicationLimit).map((item) => ({
      id: String(item._id),
      subject: item.subject ?? "",
      content: item.message,
      type: "direct",
      direction: "outbound",
      channel: "email",
      visibility: "public",
      status: (item.status as Communication["status"]) ?? "pending",
      createdAt: new Date(item.createdAt ?? item._creationTime ?? Date.now()),
      updatedAt: new Date(item.updatedAt ?? item._creationTime ?? Date.now()),
    }));
  }, [communicationLimit, communications]);

  const loading = authLoading || communications === undefined;
  const error = null;

  return {
    communications: mappedCommunications,
    analytics: [],
    loading,
    error,
  };
}
