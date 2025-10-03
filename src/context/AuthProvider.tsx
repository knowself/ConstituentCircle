"use client";

import { createContext, useContext, useMemo } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

type User = {
  id: string;
  name: string;
  profileImage?: string;
  roles?: string[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();

  const value = useMemo<AuthContextType>(() => {
    const normalizedUser: User | null = user
      ? {
          id: user.id,
          name: user.fullName ?? user.username ?? "",
          profileImage: user.imageUrl ?? undefined,
          roles: (user.publicMetadata.roles as string[] | undefined) ?? undefined,
        }
      : null;

    return {
      user: normalizedUser,
      isLoading: !isLoaded,
      isAuthenticated: !!isSignedIn,
      login: () => clerk.openSignIn(),
      logout: () => {
        void clerk.signOut({ redirectUrl: "/" });
      },
    };
  }, [clerk, isLoaded, isSignedIn, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
