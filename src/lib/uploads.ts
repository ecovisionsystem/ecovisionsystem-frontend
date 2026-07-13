"use client";

import { apiRequest, type Page } from "@/lib/api-client";

export interface UploadResource {
  id: string;
  projectId: string;
  filename: string;
  status: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
  completedAt: string | null;
  jobId: string | null;
  jobStatus: string | null;
}

export interface PresignInput {
  filename: string;
  contentType: string;
  fileSize: number;
  projectId: string;
  checksumSha256?: string;
  metadata?: Record<string, unknown>;
}

export interface PresignResponse {
  upload: UploadResource;
  uploadUrl: string;
  method: "PUT";
  expiresAt: string;
}

export const presignUpload = (input: PresignInput, token?: string) =>
  apiRequest<PresignResponse>("/uploads/presign", token, { method: "POST", body: JSON.stringify(input) });

export const completeUpload = (uploadId: string, token?: string) =>
  apiRequest<UploadResource>(`/uploads/${encodeURIComponent(uploadId)}/complete`, token, { method: "POST" });

export const getUploadStatus = (uploadId: string, token?: string) =>
  apiRequest<UploadResource>(`/uploads/${encodeURIComponent(uploadId)}`, token);

export async function listProjectUploads(projectId: string, token?: string) {
  return (await apiRequest<Page<UploadResource>>(`/projects/${encodeURIComponent(projectId)}/uploads`, token)).items;
}

export async function listProjectJobs(projectId: string, token?: string) {
  return (await apiRequest<Page<unknown>>(`/projects/${encodeURIComponent(projectId)}/jobs`, token)).items;
}

export const getJobStatus = (jobId: string, token?: string) =>
  apiRequest(`/jobs/${encodeURIComponent(jobId)}`, token);
