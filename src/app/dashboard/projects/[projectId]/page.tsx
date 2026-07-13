"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { UploadDashboard } from "@/components/upload/upload-dashboard";
import {
  getProject,
  projectPurposeLabels,
  type Project,
} from "@/lib/projects";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user, apiToken, isLoading, requireAuth, signOut } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  requireAuth();

  useEffect(() => {
    if (!isLoading && user && projectId) {
      setError("");
      getProject(projectId, apiToken)
        .then(setProject)
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load this project.",
          );
        })
        .finally(() => setLoaded(true));
    }
  }, [apiToken, isLoading, projectId, user]);

  if (isLoading || !loaded) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Loading..." breadcrumbs={[{ label: "Projects" }]} />
      </AppShell>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader
          title="Project unavailable"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects", href: "/dashboard/projects" },
          ]}
        />
        <div className="p-6 text-sm text-red-700">{error}</div>
      </AppShell>
    );
  }

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
