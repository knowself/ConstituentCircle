import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "./components/Navigation";
import EnsureUserOnLogin from "./components/EnsureUserOnLogin";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Constituent Circle",
  description: "Connecting constituents and representatives",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientProviders>
            <EnsureUserOnLogin />
            <Navigation />
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
