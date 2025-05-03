
"use client"

import { useAuth } from '@/src/context/AuthProvider'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = redirect
    }
  }, [isAuthenticated, redirect])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xs space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <button
          onClick={login}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Replit
        </button>
      </div>
    </div>
  )
}
