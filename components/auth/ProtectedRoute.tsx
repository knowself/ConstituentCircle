import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../lib/firebase/auth';
import { AuthUser } from '../../lib/firebase/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AuthUser['role'];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
