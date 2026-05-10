"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/auth/login");
  };

  // Check if user has admin access
  if (!isLoading && user && !["admin", "developer"].includes(user.role)) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-error opacity-50" />
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Access Restricted
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              You need Admin or Developer access to view this page.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-brand-primary hover:text-brand-secondary font-medium text-sm"
            >
              Go to Dashboard
            </button>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} />
        <div className="p-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user} onSignOut={handleSignOut}>
      <PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} />

      <div className="p-6 space-y-6">
        {/* System Health Section */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">API Status</p>
                  <Badge variant="success" className="mt-2">
                    OK
                  </Badge>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">SQS Queue Depth</p>
                  <p className="text-2xl font-bold text-text-primary mt-2">3</p>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">GPU Fleet</p>
                  <p className="text-2xl font-bold text-text-primary mt-2">2</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Metrics Section */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">DLQ Depth</p>
              <p className="text-sm font-mono text-text-primary">0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">RDS CPU Utilization</p>
              <p className="text-sm font-mono text-text-primary">18%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">Lambda Error Rate</p>
              <p className="text-sm font-mono text-text-primary">0%</p>
            </div>
          </div>
        </Card>

        {/* All Jobs Section */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            All Jobs
          </h3>
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
