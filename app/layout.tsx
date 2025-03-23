// app/layout.tsx
'use client';

import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import '../styles/globals.css';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexProvider client={convex}>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
