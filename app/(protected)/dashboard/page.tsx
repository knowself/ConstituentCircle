"use client";
export const dynamic = "force-dynamic";

import { SignedOut, SignInButton } from "@clerk/nextjs";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

function CommunicationsList({ representativeId }: { representativeId: string }) {
  const communications = useQuery(api.communications.getByRepresentative, {
    representativeId,
  });

  if (communications === undefined) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (communications.length === 0) {
    return <p>No recent communications found.</p>;
  }

  return (
    <ul className="space-y-2">
      {communications.slice(0, 3).map((comm) => (
        <li key={String(comm._id)} className="text-sm text-gray-600 dark:text-gray-300">
          <strong>{comm.subject ?? "Untitled"}</strong> — {comm.status}
        </li>
      ))}
    </ul>
  );
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const welcomeMessage = useMemo(() => {
    if (!user) return "Welcome to your Dashboard!";
    return user.name ? `Welcome back, ${user.name}!` : "Welcome back!";
  }, [user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated || !user?._id) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">You need to sign in to view the dashboard.</p>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{welcomeMessage}</h1>
        <Button variant="outline" asChild>
          <a href="/sign-out">Logout</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">0%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">No recent activity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationsList representativeId={String(user._id)} />
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[0, 1, 2].map((key) => (
          <Card key={key}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
