// Centralized query key factory for TanStack Query
export const queryKeys = {
  all: ["query"] as const,
  auth: {
    all: ["auth"] as const,
    user: () => ["auth", "user"] as const,
  },
  jobs: {
    all: ["jobs"] as const,
    list: (page: number = 1, limit: number = 20) =>
      ["jobs", "list", { page, limit }] as const,
    detail: (jobId: string) => ["jobs", jobId] as const,
    result: (jobId: string) => ["jobs", jobId, "result"] as const,
    byUser: (userId: string) => ["jobs", "user", userId] as const,
  },
  admin: {
    all: ["admin"] as const,
    health: () => ["admin", "health"] as const,
    jobs: (page: number = 1, limit: number = 50) =>
      ["admin", "jobs", { page, limit }] as const,
  },
  results: {
    all: ["results"] as const,
    detail: (jobId: string) => ["results", jobId] as const,
  },
} as const;
