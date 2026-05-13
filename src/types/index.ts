/* Auth Types */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ecologist" | "researcher" | "developer" | "admin";
  institution?: string;
  avatar?: string;
}

/* Job Types */
export type JobStatus =
  | "queued"
  | "preprocessing"
  | "inferencing"
  | "complete"
  | "failed";

export interface InferenceJob {
  id: string;
  filename: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: AuthUser;
  errorCode?: string;
  errorMessage?: string;
  metadata?: ImageMetadata;
  inferenceMetrics?: InferenceMetrics;
}

/* Image Types */
export type VegetationClass =
  | "spartina"
  | "puccinellia"
  | "other_veg"
  | "bare_sediment"
  | "water";

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
  crs?: string;
}

export interface ImageMetadata {
  filename: string;
  fileSize: number;
  width: number;
  height: number;
  gsd: number; // ground sample distance in meters/pixel
  crs: string; // EPSG code
  captureDate?: string;
  tileCounts: number;
  boundingBox: BoundingBox;
}

export interface InferenceMetrics {
  durationMs: number;
  modelVersion: string;
  gpuInstance: string;
  processedAt: string;
}

/* Dominance Stats */
export interface DominanceStats {
  spartina: { mean: number; lowerCI: number; upperCI: number };
  puccinellia: { mean: number; lowerCI: number; upperCI: number };
  other_veg: { mean: number; lowerCI: number; upperCI: number };
  bare_sediment: number;
  water: number;
  coverage_level: "excellent" | "good" | "moderate" | "poor";
}

export interface InferenceResult {
  jobId: string;
  segmentationUrl: string;
  confidenceMapUrl?: string;
  dominanceStats: DominanceStats;
  metadata: ImageMetadata;
  inferenceMetrics: InferenceMetrics;
  modelVersion: string;
}

/* Upload Types */
export interface UploadProgress {
  uploadId: string;
  filename: string;
  bytesTotal: number;
  bytesUploaded: number;
  speedBps: number;
  startTime: number;
  status: "idle" | "uploading" | "paused" | "completed" | "failed";
  error?: string;
}

/* Pagination */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/* Admin Types */
export interface SystemHealth {
  apiStatus: "ok" | "degraded" | "down";
  sqsQueueDepth: number;
  gpuFleetInstances: number;
  dlqDepth: number;
  rdsCpuUtilization: number;
  lambdaErrorRate: number;
  lastUpdated: string;
}
