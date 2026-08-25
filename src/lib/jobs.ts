"use client";

import { apiRequest, type Page } from "@/lib/api-client";
import type { AnalysisJobApiStatus } from "@/lib/analysis";

export interface Job {
  id: string;
  projectId: string;
  uploadId: string;
  status: AnalysisJobApiStatus;
  progressPercent: number;
  inferenceType: string;
  modelVersion: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  queuedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface CreateJobInput {
  uploadId: string;
  inferenceType: "ecovision";
}

export interface DashboardSummary {
  counts: { active: number; failed: number; completed: number };
  recentJobs: Job[];
}

export interface InferenceResult {
  id: string;
  jobId: string;
  artifacts: { segmentationMaskUrl: string | null; overlayImageUrl: string | null; dominanceJsonUrl: string | null; geotiffUrl: string | null };
  metrics: { meanIou: number | null; pixelAccuracy: number | null; meanF1: number | null };
  speciesDetected: string[];
  resultSummary: Record<string, unknown>;
  dominanceStats: Array<{ vegetationClass: string; mean: number; lowerCi: number | null; upperCi: number | null; areaM2: number | null; pixelCount: number | null }>;
  modelVersion: string;
  processedAt: string;
  createdAt: string;
}

export interface AdminStats { users: number; projects: number; uploads: number; jobsByStatus: Record<string, number> }

export const getDashboardSummary = (token?: string) => apiRequest<DashboardSummary>("/dashboard/summary", token);
export const createJob = (input: CreateJobInput, token?: string) =>
  apiRequest<Job>("/jobs", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
export const getJob = (jobId: string, token?: string) =>
  apiRequest<Job>(`/jobs/${encodeURIComponent(jobId)}`, token);
export async function listProjectJobs(projectId: string, token?: string) {
  return (
    await apiRequest<Page<Job>>(
      `/projects/${encodeURIComponent(projectId)}/jobs`,
      token,
    )
  ).items;
}
export const getInferenceResult = (jobId: string, token?: string) => apiRequest<InferenceResult>(`/results/${encodeURIComponent(jobId)}`, token);
export const getAdminStats = (token?: string) => apiRequest<AdminStats>("/admin/stats", token);
