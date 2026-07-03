export type UploadStatus =
  | "selected"
  | "registering"
  | "ready"
  | "uploading"
  | "paused"
  | "uploaded"
  | "failed";

export type UploadTab = "meta" | "inference" | "results";

export interface UploadMetadata {
  surveyName?: string;
  siteName?: string;
  captureDate?: string;
  crs?: string;
  gsd?: string;
  notes?: string;
}

export type { PresignInput as PresignUploadRequest, PresignResponse as PresignUploadResponse, UploadResource as CompleteUploadResponse, UploadResource as ProjectUpload } from "@/lib/uploads";

export interface UploadQueueFile {
  id: string;
  clientUploadId: string;
  projectId?: string;
  file?: File;
  uploadId?: string;
  jobId?: string;
  uploadUrl?: string;
  previewUrl?: string;
  metadata: UploadMetadata;
  errorMessage?: string;
  canResume: boolean;
  source?: "local" | "backend";
  name: string;
  size: number;
  contentType: string;
  gsd: string;
  crs: string;
  bands: string;
  dims: string;
  lat: string;
  lng: string;
  status: UploadStatus;
  progress: number;
}
