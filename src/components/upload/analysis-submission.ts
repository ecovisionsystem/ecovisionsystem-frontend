import { ApiError } from "@/lib/api-client";
import type { UploadQueueFile } from "./upload-types";

// Claim synchronously: mutation state alone cannot block clicks before rerender.
export function createAnalysisSubmissionGuard() {
  let pending = false;
  const accepted = new Set<string>();
  return {
    claim(file: UploadQueueFile): boolean {
      if (file.status !== "uploaded" || !file.uploadId || file.jobId || pending || accepted.has(file.uploadId)) {
        return false;
      }
      pending = true;
      return true;
    },
    finish(uploadId: string, succeeded: boolean) {
      if (succeeded) accepted.add(uploadId);
      pending = false;
    },
  };
}

export function analysisSubmissionError(error: unknown): string {
  if (error instanceof ApiError && [404, 405, 409, 503].includes(error.status)) {
    return "Analysis is currently unavailable. Please try again later.";
  }
  return "EcoVision could not start this analysis. Please try again.";
}
