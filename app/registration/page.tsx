"use client";

import { SidebarDashboard } from '@/components/SidebarDashboard';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/backend/googleServices';
import React, { useEffect, useState } from 'react';

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        redirect("/login");
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return null;
  }

  return <SidebarDashboard />;
}

export default Page;
