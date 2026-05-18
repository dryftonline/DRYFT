'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffPortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-dryft-darker flex items-center justify-center">
      <div className="text-white/40 text-sm">Redirecting to DRYFT Dashboard...</div>
    </div>
  );
}
