"use client";

import { apiRequest } from "@/lib/api-client";

export interface Job {
  id: string;
  projectId: string;
  uploadId: string;
  status: string;
  progressPercent: number;
  inferenceType: string;
  modelVersion: string;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
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
}

export interface AdminStats { users: number; projects: number; uploads: number; jobsByStatus: Record<string, number> }

export const getDashboardSummary = (token?: string) => apiRequest<DashboardSummary>("/dashboard/summary", token);
export const getInferenceResult = (jobId: string, token?: string) => apiRequest<InferenceResult>(`/results/${encodeURIComponent(jobId)}`, token);
export const getAdminStats = (token?: string) => apiRequest<AdminStats>("/admin/stats", token);
