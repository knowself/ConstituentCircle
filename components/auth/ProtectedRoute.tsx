import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user) {
          await router.push('/auth/signin');
          return;
        }

        if (requiredRole) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error || profile?.role !== requiredRole) {
            await router.push('/unauthorized');
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, requiredRole, router, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}
