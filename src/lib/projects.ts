"use client";

import { getOptionalApiBaseUrl } from "@/lib/api-config";

export type ProjectPurpose =
  | "run_inference"
  | "training_repository"
  | "request";

export interface Project {
  id: string;
  name: string;
  purpose: ProjectPurpose;
  createdAt: string;
  ownerId?: string;
}

export interface CreateProjectInput {
  name: string;
  purpose: ProjectPurpose;
}

const STORAGE_KEY = "ecovision.projects";
const API_PREFIX = "/api/v1";

export const projectPurposeLabels: Record<ProjectPurpose, string> = {
  run_inference: "Run inference",
  training_repository: "Training repository",
  request: "Request",
};

export async function createProject(
  input: CreateProjectInput,
  accessToken?: string,
) {
  const apiProject = await tryApiProject<Project>(
    `${API_PREFIX}/projects`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    accessToken,
  );

  if (apiProject) {
    saveLocalProject(apiProject);
    return apiProject;
  }

  const project: Project = {
    id: createProjectId(),
    name: input.name,
    purpose: input.purpose,
    createdAt: new Date().toISOString(),
  };
  saveLocalProject(project);
  return project;
}

export async function listProjects(accessToken?: string) {
  const apiProjects = await tryApiProject<Project[]>(
    `${API_PREFIX}/projects`,
    {},
    accessToken,
  );
  if (apiProjects) {
    writeLocalProjects(apiProjects);
    return apiProjects;
  }
  return readLocalProjects();
}

export async function getProject(projectId: string, accessToken?: string) {
  const apiProject = await tryApiProject<Project>(
    `${API_PREFIX}/projects/${encodeURIComponent(projectId)}`,
    {},
    accessToken,
  );
  if (apiProject) {
    saveLocalProject(apiProject);
    return apiProject;
  }
  return (
    readLocalProjects().find((project) => project.id === projectId) || null
  );
}

function createProjectId() {
  return `project_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

async function tryApiProject<T>(
  path: string,
  init: RequestInit,
  accessToken?: string,
): Promise<T | null> {
  const apiBaseUrl = getOptionalApiBaseUrl();
  if (!apiBaseUrl || !accessToken) return null;

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers || {}),
      },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function readLocalProjects() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function writeLocalProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function saveLocalProject(project: Project) {
  const projects = readLocalProjects();
  const nextProjects = [
    project,
    ...projects.filter((current) => current.id !== project.id),
  ];
  writeLocalProjects(nextProjects);
}
