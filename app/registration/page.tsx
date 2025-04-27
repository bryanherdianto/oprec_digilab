"use client";

import { SidebarDemo } from '@/components/SidebarDemo';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/backend/googleServices';
import React, { useEffect, useState } from 'react';

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return null;
  }

  return <SidebarDemo />;
}

export default Page;
