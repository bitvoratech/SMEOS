// app/dashboard/layout.tsx

"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }

    if (
      !isLoading &&
      user &&
      !user.memberships?.length
    ) {
      router.push("/onboarding");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />

          <p className="text-sm text-[#5F6368]">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7F5]">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}