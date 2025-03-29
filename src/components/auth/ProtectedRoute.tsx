import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// Replace Supabase with Convex
import { useQuery } from "convex/react";
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../context/AuthContext';
import { Id } from '../../../convex/_generated/dataModel';
import Loading from '../Loading';

// Define a proper interface for the user object
interface User {
  _id: Id<"users">;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user: authUser, isLoading: authLoading } = useAuth();
  // Better typing for the user state
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Replace Supabase client with Convex query
  const userRole = useQuery(api.users.getUserRole, 
    authUser ? { userId: authUser._id } : "skip"
  );
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
      try {
        if (!authLoading) {
          if (authUser) {
            setUser(authUser);
            
            // Check role if required
            if (requiredRole) {
              // Use Convex query result instead of Supabase
              if (userRole === undefined) {
                // Still loading
                return;
              }
              
              if (userRole === null) {
                console.error('Role check error');
                setError('Failed to verify user role');
                router.push('/unauthorized');
                return;
              }

              if (userRole !== requiredRole) {
                console.log(`User role ${userRole} does not match required role ${requiredRole}`);
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
            router.push('/auth/signin');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError('An error occurred while checking authentication');
        setLoading(false);
      }
    };

    handleAuth();
  }, [authUser, authLoading, mounted, requiredRole, router, userRole]);

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

  if (!user) {
    return <Loading size="medium" message="Redirecting to login..." />;
  }

  // User is authenticated and meets role requirements
  return <>{children}</>;
}
