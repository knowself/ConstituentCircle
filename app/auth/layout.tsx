// app/auth/layout.tsx
import React from 'react';

// This layout now simply passes children through.
// The root layout (app/layout.tsx) and its ClientProviders
// handle the necessary context providers (Convex, Auth, Theme)
// and the overall page structure (Navigation, Footer).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
