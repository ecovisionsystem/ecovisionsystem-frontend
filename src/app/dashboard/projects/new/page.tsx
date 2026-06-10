"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";

export default function NewProjectPage() {
  const { user, isLoading, requireAuth, signOut } = useAuth();
  const [open, setOpen] = useState(true);

  requireAuth();

  useEffect(() => {
    setOpen(true);
  }, []);

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Loading..." breadcrumbs={[{ label: "Projects" }]} />
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell user={user} onSignOut={signOut}>
      <PageHeader
        title="New Project"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          { label: "New Project" },
        ]}
      />
      <div className="p-6">
        <div className="max-w-2xl rounded-lg border border-border bg-surface-raised p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Create a project workspace
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Add a project name and choose the purpose to start uploading imagery.
          </p>
        </div>
      </div>
      <ProjectCreateModal
        open={open}
        onOpenChange={setOpen}
        cancelHref="/dashboard"
      />
    </AppShell>
  );
}
