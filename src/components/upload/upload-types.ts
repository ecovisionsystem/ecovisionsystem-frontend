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

export interface PresignUploadRequest {
  filename: string;
  contentType: string;
  fileSize: number;
  projectId: string;
  inferenceType?: string;
}

export interface PresignUploadResponse {
  uploadId: string;
  jobId: string | null;
  s3Bucket: string;
  s3Key: string;
  objectRef?: string;
  uploadUrl: string;
  method: "PUT";
  expiresIn: number;
  status: "ready";
}

export interface CompleteUploadResponse {
  uploadId: string;
  status: "uploaded" | string;
  jobId: string | null;
  jobStatus?: string;
  s3Bucket: string;
  s3Key: string;
}

export interface ProjectUpload {
  uploadId: string;
  filename: string;
  status: UploadStatus | string;
  s3Bucket: string;
  s3Key: string;
  objectRef: string;
  jobId: string | null;
}

export interface UploadQueueFile {
  id: string;
  clientUploadId: string;
  projectId?: string;
  file?: File;
  uploadId?: string;
  jobId?: string;
  uploadUrl?: string;
  previewUrl?: string;
  s3Bucket?: string;
  s3Key?: string;
  objectRef?: string;
  metadata: UploadMetadata;
  errorMessage?: string;
  canResume: boolean;
  source?: "local" | "backend" | "demo";
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
