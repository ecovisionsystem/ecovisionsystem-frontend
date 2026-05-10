"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { AppShell, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignOut = () => {
    // Sign out logic
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Loading..." breadcrumbs={[{ label: "Dashboard" }]} />
        <div className="p-6 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    );
  }

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p className="text-text-secondary">Redirecting to login...</p>
  //     </div>
  //   );
  // }

  return (
    <AppShell user={user} onSignOut={handleSignOut}>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <Button onClick={() => router.push("/upload")}>
            <Plus className="h-4 w-4" />
            New Upload
          </Button>
        }
      />

      <div className="p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card padding="lg" className="text-center">
            <p className="text-3xl font-bold text-brand-primary">3</p>
            <p className="text-sm text-text-secondary mt-2">Active Jobs</p>
          </Card>
          <Card padding="lg" className="text-center">
            <p className="text-3xl font-bold text-error">1</p>
            <p className="text-sm text-text-secondary mt-2">Failed Jobs</p>
          </Card>
          <Card padding="lg" className="text-center">
            <p className="text-3xl font-bold text-success">12</p>
            <p className="text-sm text-text-secondary mt-2">Completed Jobs</p>
          </Card>
        </div>

        {/* Jobs Table Placeholder */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Recent Jobs
          </h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
