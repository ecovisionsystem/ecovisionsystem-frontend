"use client";

import React from "react";
import Link from "next/link";
import { FolderOpen, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsIndexPage() {
  const { user, isLoading, requireAuth, signOut } = useAuth();

  requireAuth();

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Results" breadcrumbs={[{ label: "Results" }]} />
        <div className="space-y-4 p-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell user={user} onSignOut={signOut}>
      <PageHeader
        title="Results"
        description="Open a project to view uploaded imagery and inference outputs."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Results" },
        ]}
        action={
          <Link href="/dashboard/projects">
            <Button>
              <FolderOpen className="h-4 w-4" />
              All Projects
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <Card className="flex min-h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted text-brand-primary">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            Results are project-based
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            Select a project, upload imagery, then open an inference job result
            when it is available.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
