"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ErrorBoundary } from "../ErrorBoundary";
import React, { useMemo } from "react";
import { AuthProvider } from "@/context/AuthProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const convexClient = useMemo(() => convex, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ConvexProvider client={convexClient}>
          <AuthProvider>{children}</AuthProvider>
        </ConvexProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
