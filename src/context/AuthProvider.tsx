
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

type User = {
  id: string;
  name: string;
  profileImage?: string;
  roles?: string[];
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const res = await fetch('/__replauthuser')
      if (res.ok) {
        const userData = await res.json()
        setUser({
          id: userData.id,
          name: userData.name,
          profileImage: userData.profileImage,
          roles: userData.roles
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = () => {
    window.addEventListener("message", authComplete)
    const h = 500
    const w = 350
    const left = screen.width / 2 - w / 2
    const top = screen.height / 2 - h / 2

    const authWindow = window.open(
      `https://replit.com/auth_with_repl_site?domain=${location.host}`,
      "_blank",
      `modal=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${w},height=${h},top=${top},left=${left}`
    )

    function authComplete(e: MessageEvent) {
      if (e.data !== "auth_complete") return
      window.removeEventListener("message", authComplete)
      authWindow?.close()
      fetchUser()
    }
  }

  const logout = async () => {
    const res = await fetch('/__replauthlogout')
    if (res.ok) {
      setUser(null)
      router.push('/')
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
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
