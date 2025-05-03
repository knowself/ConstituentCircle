
'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/__replauthuser');
      if (response.ok) {
        const user = await response.json();
        if (user) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex justify-center items-center min-h-screen py-12 bg-background">
      <div className="text-center">
        <script src="https://auth.util.repl.co/script.js" data-authed="location.reload()"></script>
      </div>
    </div>
  );
}
