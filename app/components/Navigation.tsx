"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ProfileBadge from "./ProfileBadge";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-background">
      <Link href="/" className="font-semibold text-lg">
        Constituent Circle
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/services" className="text-sm text-muted-foreground">
          Services
        </Link>
        <Link href="/blog" className="text-sm text-muted-foreground">
          Blog
        </Link>
        <Link href="/contact" className="text-sm text-muted-foreground">
          Contact
        </Link>
        <ProfileBadge />
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="text-sm font-medium">
            Sign in
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}
