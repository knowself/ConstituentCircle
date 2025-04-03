'use client';

import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useEffect, useState } from 'react';
// Replace Supabase with Convex
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api"; // Use alias
import { useAuth } from '@/context/AuthContext'; // Use alias
import type { User } from '@/hooks/useAuth'; // Import correct User type
import { Id } from '../../../convex/_generated/dataModel';
import Loading from '../Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run this effect on the client side
    if (!mounted) return;
    
    const handleAuth = async () => {
      if (!authLoading) {
        if (authUser) {
          // Check role if required
          if (requiredRole) {
            // Check user role from the user object directly now
            if (!authUser.role) { 
              console.error('Role check error: User object missing role property.');
              setError('Failed to verify user role');
              router.push('/unauthorized');
              return;
            }

            if (authUser.role !== requiredRole) { 
              console.log(`User role ${authUser.role} does not match required role ${requiredRole}`);
              setError('Unauthorized: Insufficient permissions');
              router.push('/unauthorized');
              return;
            }
          }
            
          setLoading(false);
          setError(null);
        } else {
          // No authenticated user, redirect to sign in
          console.log('No authenticated user, redirecting to sign in');
          setError('Please sign in to access this page');
          router.push('/auth/signin'); // TODO: Make signin path configurable?
          setLoading(false);
        }
      } 
    };

    handleAuth();
  }, [authUser, authLoading, mounted, requiredRole, router]);

  // During server-side rendering or before mounting, return a minimal placeholder
  // to prevent hydration mismatch
  if (!mounted) {
    return <div></div>;
  }
  
  if (loading) {
    return <Loading size="large" message="Checking authentication..." />;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!authUser) { 
    return <Loading size="medium" message="Redirecting to login..." />;
  }

  // User is authenticated and meets role requirements
  return <>{children}</>;
}
