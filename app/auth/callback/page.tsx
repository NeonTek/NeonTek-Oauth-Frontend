"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      login(accessToken).then(() => {
        router.push('/dashboard');
      });
    } else {
      router.push('/login');
    }
  }, [login, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Please wait, authenticating...</p>
    </div>
  );
}


export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}