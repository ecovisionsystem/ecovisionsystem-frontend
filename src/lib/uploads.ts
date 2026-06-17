"use client";

import type {
  CompleteUploadResponse,
  PresignUploadRequest,
  PresignUploadResponse,
  ProjectUpload,
} from "@/components/upload/upload-types";

const API_PREFIX = "/api/v1";

export async function presignUpload(
  input: PresignUploadRequest,
  accessToken?: string,
) {
  return apiRequest<PresignUploadResponse>("/uploads/presign", {
    accessToken,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function completeUpload(uploadId: string, accessToken?: string) {
  return apiRequest<CompleteUploadResponse>(
    `/uploads/${encodeURIComponent(uploadId)}/complete`,
    {
      accessToken,
      method: "POST",
    },
  );
}

export async function getUploadStatus(uploadId: string, accessToken?: string) {
  return apiRequest<ProjectUpload>(`/uploads/${encodeURIComponent(uploadId)}`, {
    accessToken,
  });
}

export async function listProjectUploads(
  projectId: string,
  accessToken?: string,
) {
  return apiRequest<ProjectUpload[]>(
    `/projects/${encodeURIComponent(projectId)}/uploads`,
    {
      accessToken,
    },
  );
}

export async function listProjectJobs(projectId: string, accessToken?: string) {
  return apiRequest(`/projects/${encodeURIComponent(projectId)}/jobs`, {
    accessToken,
  });
}

export async function getJobStatus(jobId: string, accessToken?: string) {
  return apiRequest(`/jobs/${encodeURIComponent(jobId)}`, {
    accessToken,
  });
}

export async function listInferenceTypes(accessToken?: string) {
  return apiRequest("/inference-types", { accessToken });
}

async function apiRequest<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }
  if (!init.accessToken) {
    throw new Error("You must be signed in before uploading files.");
  }

  const { accessToken, headers, ...requestInit } = init;
  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}${API_PREFIX}${path}`,
    {
      ...requestInit,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    },
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || response.statusText || "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.message || data?.detail || data?.error;
  } catch {
    return response.statusText;
  }
}
