'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export const useRequireAuth = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.user) router.push('/login');
  }, [auth.isLoading, auth.user, router]);

  return {
    ...auth,
    isReady: !auth.isLoading && !!auth.user,
  };
};
