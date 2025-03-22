// app/layout.tsx
'use client';

import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import { ConvexClientProvider } from "../components/ConvexClientProvider";
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}