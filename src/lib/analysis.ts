export const ECOVISION_INFERENCE_TYPE = "ecovision" as const;
export const ACTIVE_JOB_POLL_INTERVAL_MS = 4_000;

export type AnalysisJobApiStatus =
  | "pending"
  | "queued"
  | "preprocessing"
  | "inferencing"
  | "postprocessing"
  | "completed"
  | "failed"
  | "cancelled";

export type AnalysisJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

const API_STATUSES = new Set<AnalysisJobApiStatus>([
  "pending",
  "queued",
  "preprocessing",
  "inferencing",
  "postprocessing",
  "completed",
  "failed",
  "cancelled",
]);

export function isAnalysisJobApiStatus(
  status: string,
): status is AnalysisJobApiStatus {
  return API_STATUSES.has(status as AnalysisJobApiStatus);
}

export function normalizeAnalysisStatus(status: string): AnalysisJobStatus {
  switch (status) {
    case "pending":
    case "queued":
      return "queued";
    case "preprocessing":
    case "inferencing":
    case "postprocessing":
      return "processing";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "failed":
    default:
      return "failed";
  }
}

export function isActiveAnalysisStatus(status: string) {
  const normalized = normalizeAnalysisStatus(status);
  return normalized === "queued" || normalized === "processing";
}

export function analysisPollInterval(status?: string) {
  return status && isActiveAnalysisStatus(status)
    ? ACTIVE_JOB_POLL_INTERVAL_MS
    : false;
}

export function shortJobReference(jobId: string) {
  return `JOB-${jobId.replace(/-/g, "").slice(-8).toUpperCase()}`;
}

export interface DominanceValue {
  vegetationClass: string;
  mean: number;
}

export function dominantSpecies<T extends DominanceValue>(stats: T[]) {
  return stats.reduce<T | null>((dominant, current) => {
    if (!Number.isFinite(current.mean)) return dominant;
    if (!dominant || current.mean > dominant.mean) return current;
    return dominant;
  }, null);
}
