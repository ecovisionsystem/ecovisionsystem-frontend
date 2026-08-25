export const queryKeys = {
  dashboard: {
    summary: (scope: string) => ["dashboard", scope, "summary"] as const,
  },
  projects: {
    all: (scope: string) => ["projects", scope] as const,
    detail: (scope: string, projectId: string) =>
      ["projects", scope, projectId] as const,
  },
  uploads: {
    project: (scope: string, projectId: string) =>
      ["uploads", scope, "project", projectId] as const,
    preview: (scope: string, uploadId: string) =>
      ["uploads", scope, uploadId, "preview"] as const,
  },
  jobs: {
    detail: (scope: string, jobId: string) =>
      ["jobs", scope, jobId] as const,
    project: (scope: string, projectId: string) =>
      ["jobs", scope, "project", projectId] as const,
    result: (scope: string, jobId: string) =>
      ["jobs", scope, jobId, "result"] as const,
  },
  admin: {
    stats: (scope: string) => ["admin", scope, "stats"] as const,
  },
} as const;
