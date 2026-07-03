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
    throw new Error(problem?.detail || response.statusText || "Request failed.");
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
