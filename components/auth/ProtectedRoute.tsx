import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
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
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authUser.id)
                .single();

              if (error) {
                console.error('Role check error:', error);
                setError('Failed to verify user role');
                router.push('/unauthorized');
                return;
              }

              if (!profile || profile.role !== requiredRole) {
                console.log(`User role ${profile?.role} does not match required role ${requiredRole}`);
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
  }, [authUser, authLoading, mounted, requiredRole, router, supabase]);

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
