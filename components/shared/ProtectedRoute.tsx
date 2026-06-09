
'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: any) => state.auth?.user);
  const router = useRouter();

  useEffect(() => {
    // If the user state is empty, smoothly redirect them back home
    if (!user) {
      router.replace('/'); 
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return <>{children}</>;
}