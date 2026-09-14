"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  ECOVISION_INFERENCE_TYPE,
  ACTIVE_JOB_POLL_INTERVAL_MS,
  analysisPollInterval,
  isActiveAnalysisStatus,
} from "@/lib/analysis";
import {
  createJob,
  getDashboardSummary,
  getInferenceResult,
  getJob,
  listProjectJobs,
  type Job,
} from "@/lib/jobs";
import {
  createProject,
  getProject,
  listProjects,
  type CreateProjectInput,
} from "@/lib/projects";
import {
  getUploadPreview,
  getUploadStatus,
  listProjectUploads,
} from "@/lib/uploads";
import { invalidateTerminalJobQueries } from "@/lib/job-cache";
import { queryKeys } from "@/lib/query-keys";

function useApiContext() {
  const { apiToken, user } = useAuth();
  return { apiToken, scope: user?.id ?? "anonymous", ready: Boolean(apiToken && user) };
}

export function useDashboardSummary() {
  const { apiToken, scope, ready } = useApiContext();
  const query = useQuery({
    queryKey: queryKeys.dashboard.summary(scope),
    queryFn: () => getDashboardSummary(apiToken),
    enabled: ready,
    refetchInterval: (query) =>
      query.state.data && query.state.data.counts.active > 0
        ? ACTIVE_JOB_POLL_INTERVAL_MS
        : false,
  });
  useInvalidateTerminalJobs(query.data?.recentJobs);
  return query;
}

export function useProjects() {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.projects.all(scope),
    queryFn: () => listProjects(apiToken),
    enabled: ready,
  });
}

export function useProject(projectId?: string) {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.projects.detail(scope, projectId || "missing"),
    queryFn: () => getProject(projectId as string, apiToken),
    enabled: ready && Boolean(projectId),
  });
}

export function useProjectUploads(projectId?: string) {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.uploads.project(scope, projectId || "missing"),
    queryFn: () => listProjectUploads(projectId as string, apiToken),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    enabled: ready && Boolean(projectId),
  });
}

export function useProjectJobs(projectId?: string) {
  const { apiToken, scope, ready } = useApiContext();
  const query = useQuery({
    queryKey: queryKeys.jobs.project(scope, projectId || "missing"),
    queryFn: () => listProjectJobs(projectId as string, apiToken),
    refetchInterval: (query) =>
      query.state.data?.some((job) => isActiveAnalysisStatus(job.status))
        ? ACTIVE_JOB_POLL_INTERVAL_MS : false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    enabled: ready && Boolean(projectId),
  });
  useInvalidateTerminalJobs(query.data);
  return query;
}

export function useJob(jobId?: string) {
  const { apiToken, scope, ready } = useApiContext();
  const query = useQuery({
    queryKey: queryKeys.jobs.detail(scope, jobId || "missing"),
    queryFn: () => getJob(jobId as string, apiToken),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    enabled: ready && Boolean(jobId),
    refetchInterval: (query) => {
      const job = query.state.data as Job | undefined;
      return analysisPollInterval(job?.status);
    },
  });

  useInvalidateTerminalJobs(query.data ? [query.data] : undefined);

  return query;
}

function useInvalidateTerminalJobs(jobs?: Job[]) {
  const { scope } = useApiContext();
  const queryClient = useQueryClient();
  useEffect(() => {
    jobs?.forEach((job) => invalidateTerminalJobQueries(queryClient, scope, job));
  }, [jobs, queryClient, scope]);
}

export function useJobResult(jobId?: string, enabled = true) {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.jobs.result(scope, jobId || "missing"),
    queryFn: () => getInferenceResult(jobId as string, apiToken),
    enabled: ready && enabled && Boolean(jobId),
    staleTime: 0,
    refetchOnMount: "always",
    retry: 2,
  });
}

export function useUpload(uploadId?: string) {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.uploads.detail(scope, uploadId || "missing"),
    queryFn: () => getUploadStatus(uploadId as string, apiToken),
    enabled: ready && Boolean(uploadId),
  });
}

export function useUploadPreview(uploadId?: string, enabled = true) {
  const { apiToken, scope, ready } = useApiContext();
  return useQuery({
    queryKey: queryKeys.uploads.preview(scope, uploadId || "missing"),
    queryFn: () => getUploadPreview(uploadId as string, apiToken),
    enabled: ready && enabled && Boolean(uploadId),
    staleTime: 4 * 60 * 1000,
  });
}

export function useCreateProject() {
  const { apiToken, scope } = useApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input, apiToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all(scope) }),
  });
}

export function useCreateJob() {
  const { apiToken, scope } = useApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadId: string) =>
      createJob(
        { uploadId, inferenceType: ECOVISION_INFERENCE_TYPE },
        apiToken,
      ),
    onSuccess: (job) => {
      queryClient.setQueryData(queryKeys.jobs.detail(scope, job.id), job);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.project(scope, job.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.uploads.project(scope, job.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(scope),
      });
    },
  });
}
