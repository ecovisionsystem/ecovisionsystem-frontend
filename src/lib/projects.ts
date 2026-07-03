"use client";

import { apiRequest, type Page } from "@/lib/api-client";

export type ProjectPurpose = "inference" | "training_repository" | "request";

export interface Project {
  id: string;
  name: string;
  purpose: ProjectPurpose;
  ownerId: string;
  description: string | null;
  location: string | null;
  crs: string | null;
  areaOfInterest: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  purpose: ProjectPurpose;
  description?: string;
  location?: string;
  crs?: string;
  areaOfInterest?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const projectPurposeLabels: Record<ProjectPurpose, string> = {
  inference: "Run inference",
  training_repository: "Training repository",
  request: "Request",
};

export function createProject(input: CreateProjectInput, token?: string) {
  return apiRequest<Project>("/projects", token, { method: "POST", body: JSON.stringify(input) });
}

export async function listProjects(token?: string) {
  return (await apiRequest<Page<Project>>("/projects", token)).items;
}

export function getProject(projectId: string, token?: string) {
  return apiRequest<Project>(`/projects/${encodeURIComponent(projectId)}`, token);
}

export function archiveProject(projectId: string, token?: string) {
  return apiRequest<Project>(`/projects/${encodeURIComponent(projectId)}`, token, { method: "DELETE" });
}
