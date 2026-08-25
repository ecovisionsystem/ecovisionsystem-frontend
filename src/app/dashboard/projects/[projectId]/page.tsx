"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { UploadDashboard } from "@/components/upload/upload-dashboard";
import { projectPurposeLabels } from "@/lib/projects";
import { useProject } from "@/hooks/useAnalysisQueries";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user, isLoading, signOut } = useAuth();
  const projectQuery = useProject(projectId);

  useRequireAuth();

  if (isLoading || projectQuery.isLoading) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Loading..." breadcrumbs={[{ label: "Projects" }]} />
      </AppShell>
    );
  }

  if (!user) return null;

  if (projectQuery.error) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader
          title="Project unavailable"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects", href: "/dashboard/projects" },
          ]}
        />
        <div className="p-6 text-sm text-red-700">{projectQuery.error.message}</div>
      </AppShell>
    );
  }

  const project = projectQuery.data;
  const projectName = project?.name || "Untitled project";

  return (
    <AppShell user={user} onSignOut={signOut}>
      <PageHeader
        title={projectName}
        description={
          project
            ? projectPurposeLabels[project.purpose]
            : "Project workspace"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          { label: projectName },
        ]}
      />
      <UploadDashboard
        projectId={projectId}
        projectName={projectName}
        initialUploadedFiles={[]}
      />
    </AppShell>
  );
}
