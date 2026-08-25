"use client";

import { getApiBaseUrl } from "@/lib/api-config";

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  requestId?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly requestId?: string;

  constructor(status: number, message: string, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.requestId = requestId;
  }
}

export async function apiRequest<T>(
  path: string,
  accessToken: string | undefined,
  init: RequestInit = {},
): Promise<T> {
  if (!accessToken) throw new Error("You must be signed in.");
  const response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as ProblemDetail | null;
    throw new ApiError(
      response.status,
      problem?.detail || response.statusText || "Request failed.",
      problem?.requestId || response.headers.get("x-request-id") || undefined,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
