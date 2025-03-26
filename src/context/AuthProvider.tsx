"use client"

import { createContext, useContext, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { User, AuthContextType } from "./types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const user = useQuery(api.auth.getCurrentUser)
  const isLoading = !isInitialized

  // Mutations
  const loginMutation = useMutation(api.auth.login)
  const registerMutation = useMutation(api.auth.register)
  const logoutMutation = useMutation(api.auth.logout)
  const updateProfileMutation = useMutation(api.auth.updateProfile)

  // Auth handlers
  const handleLogin = async (email: string, password: string) => {
    try {
      await loginMutation({ email, password })
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await registerMutation({ name, email, password })
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation()
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  const handleUpdateProfile = async (userData: Partial<User>) => {
    try {
      await updateProfileMutation(userData)
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  }

  const value = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}