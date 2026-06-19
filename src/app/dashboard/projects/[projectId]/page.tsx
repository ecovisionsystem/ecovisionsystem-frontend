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

  requireAuth();

  useEffect(() => {
    if (!isLoading && user && projectId) {
      getProject(projectId, apiToken).then((nextProject) => {
        setProject(nextProject);
        setLoaded(true);
      });
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

  const projectName = project?.name || "Untitled project";

  return (
    <AppShell user={user} onSignOut={signOut}>
      <PageHeader
        title={projectName}
        description={
          project
            ? projectPurposeLabels[project.purpose]
            : "Local project workspace"
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
        projectPurpose={project?.purpose}
        initialUploadedFiles={[]}
      />
    </AppShell>
  );
}
