"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import {
  listProjects,
  projectPurposeLabels,
  type Project,
} from "@/lib/projects";

export default function ProjectsPage() {
  const { user, apiToken, isLoading, requireAuth, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  requireAuth();

  useEffect(() => {
    if (!isLoading && user) {
      setError("");
      listProjects(apiToken)
        .then(setProjects)
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load projects.",
          );
        });
    }
  }, [apiToken, isLoading, user]);

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
        title="Projects"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects" },
        ]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            New Project
          </Button>
        }
      />
      <div className="p-6">
        {error ? (
          <Card className="border-red-200 bg-red-50 text-center">
            <h2 className="text-lg font-semibold text-red-900">
              Projects are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="text-center">
            <h2 className="text-lg font-semibold text-text-primary">
              No projects yet
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Create a project to organize uploads and inference runs.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
              >
                <Card className="h-full transition-colors hover:bg-surface-overlay">
                  <p className="text-lg font-semibold text-text-primary">
                    {project.name}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    {projectPurposeLabels[project.purpose]}
                  </p>
                  <p className="mt-4 text-xs text-text-muted">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ProjectCreateModal open={modalOpen} onOpenChange={setModalOpen} />
    </AppShell>
  );
}
