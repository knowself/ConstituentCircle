import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/signin');
  }, [router]);

  return <div>Redirecting to sign in...</div>;
}