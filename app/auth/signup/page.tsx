"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp routing="path" path="/auth/signup" signInUrl="/auth/signin" />
    </div>
  );
}
