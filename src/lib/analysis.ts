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
  | "unknown"
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
      return "failed";
    default:
      return "unknown";
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

export function isValidDominanceMean(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function formatDominancePercent(value: number) {
  return isValidDominanceMean(value) ? `${(value * 100).toFixed(1)}%` : "Unavailable";
}

export function dominantSpecies<T extends DominanceValue>(stats: T[]) {
  return stats.reduce<T | null>((dominant, current) => {
    if (!isValidDominanceMean(current.mean)) return dominant;
    if (!dominant || current.mean > dominant.mean) return current;
    return dominant;
  }, null);
}


export function groupAnalysisStatusCounts(counts: Record<string, number>) {
  const groups = new Map<AnalysisJobStatus, { status: string; count: number }>();
  for (const [status, count] of Object.entries(counts)) {
    const key = normalizeAnalysisStatus(status);
    const existing = groups.get(key);
    if (existing) existing.count += count;
    else groups.set(key, { status, count });
  }
  // Retain a backend status for the shared component; never invent a pipeline stage.
  return Array.from(groups.values());
}


export function formatVegetationClass(value: string) {
  const name = value.replace(/[_-]+/g, " ").trim().replace(/\s+/g, " ").toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
}
