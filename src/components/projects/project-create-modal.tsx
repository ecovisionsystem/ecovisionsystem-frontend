"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/useAnalysisQueries";

interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelHref?: string;
}

export function ProjectCreateModal({
  open,
  onOpenChange,
  cancelHref,
}: ProjectCreateModalProps) {
  const router = useRouter();
  const createProject = useCreateProject();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleCancel = () => {
    onOpenChange(false);
    if (cancelHref) router.push(cancelHref);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      const project = await createProject.mutateAsync({
        name: name.trim(),
        purpose: "inference",
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
      onOpenChange(false);
      setName("");
      setLocation("");
      setDescription("");
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create project.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand-primary">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                New project
              </h2>
              <p className="text-sm text-text-secondary">
                Create a project workspace for imagery and inference.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text-primary">
              Project name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Foryd Bay July survey"
              disabled={createProject.isPending}
              className="h-12 w-full rounded-md border border-border bg-surface px-3 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
            />
          </label>

          <div className="rounded-md border border-border bg-surface-overlay px-3 py-2">
            <p className="text-sm font-medium text-text-primary">
              Inference project
            </p>
            <p className="text-xs text-text-secondary">
              Upload UAV imagery and run EcoVision analysis.
            </p>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text-primary">
              Location or site <span className="font-normal text-text-muted">(optional)</span>
            </span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Foryd Bay"
              disabled={createProject.isPending}
              className="h-12 w-full rounded-md border border-border bg-surface px-3 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text-primary">
              Description <span className="font-normal text-text-muted">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="July UAV vegetation survey"
              disabled={createProject.isPending}
              rows={3}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
            />
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createProject.isPending}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
