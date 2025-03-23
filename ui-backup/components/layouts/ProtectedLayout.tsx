'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Loading from '../ui/Loading';

interface ProtectedLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
}

export default function ProtectedLayout({
  children,
  requireAuth = false,
  requireGuest = false,
}: ProtectedLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Add auth check logic here later
    setLoading(false);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}