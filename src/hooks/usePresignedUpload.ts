"use client";

import { useCallback, useRef } from "react";
import { completeUpload, presignUpload } from "@/lib/uploads";
import type { ProjectPurpose } from "@/lib/projects";
import type {
  CompleteUploadResponse,
  PresignUploadResponse,
  UploadQueueFile,
} from "@/components/upload/upload-types";

interface UsePresignedUploadOptions {
  projectId?: string;
  projectPurpose?: ProjectPurpose;
  accessToken?: string;
  onUpdate: (
    clientUploadId: string,
    patch: Partial<UploadQueueFile>,
  ) => void;
  onUploaded?: (
    file: UploadQueueFile,
    completeResponse: CompleteUploadResponse,
  ) => void;
}

export function usePresignedUpload({
  projectId,
  projectPurpose,
  accessToken,
  onUpdate,
  onUploaded,
}: UsePresignedUploadOptions) {
  const requestsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const presignRef = useRef<Map<string, PresignUploadResponse>>(new Map());

  const start = useCallback(
    async (file: UploadQueueFile) => {
      if (!file.file) {
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage: "No local file is attached to this upload item.",
        });
        return;
      }

      const activeProjectId = file.projectId || projectId;
      if (!activeProjectId) {
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage: "Project context is required before uploading.",
        });
        return;
      }

      if (!accessToken) {
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage: "You must be signed in before uploading files.",
          canResume: false,
        });
        return;
      }

      try {
        onUpdate(file.clientUploadId, {
          status: "registering",
          progress: 0,
          errorMessage: undefined,
          canResume: false,
        });

        const presign = await presignUpload(
          {
            filename: file.name,
            contentType: file.contentType || "application/octet-stream",
            fileSize: file.size,
            projectId: activeProjectId,
            inferenceType:
              projectPurpose === "inference"
                ? "vegetation_segmentation"
                : undefined,
            metadata: { ...file.metadata },
          },
          accessToken,
        );

        presignRef.current.set(file.clientUploadId, presign);

        onUpdate(file.clientUploadId, {
          status: "ready",
          uploadId: presign.upload.id,
          jobId: presign.upload.jobId || undefined,
          uploadUrl: presign.uploadUrl,
        });

        onUpdate(file.clientUploadId, {
          status: "uploading",
          progress: 0,
          errorMessage: undefined,
        });

        await putToS3({
          file,
          presign,
          onProgress: (progress) => {
            onUpdate(file.clientUploadId, {
              status: "uploading",
              progress,
              errorMessage: undefined,
            });
          },
          onRequest: (request) => {
            requestsRef.current.set(file.clientUploadId, request);
          },
        });
        requestsRef.current.delete(file.clientUploadId);

        const completeResponse = await completeUpload(
          presign.upload.id,
          accessToken,
        );

        onUpdate(file.clientUploadId, {
          status: "uploaded",
          progress: 100,
          uploadId: completeResponse.id,
          jobId: completeResponse.jobId || presign.upload.jobId || undefined,
          errorMessage: undefined,
          canResume: false,
        });

        onUploaded?.(file, completeResponse);
      } catch (error) {
        requestsRef.current.delete(file.clientUploadId);
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Upload failed.",
          canResume: false,
        });
      }
    },
    [accessToken, onUpdate, onUploaded, projectId, projectPurpose],
  );

  const retry = useCallback(
    async (file: UploadQueueFile) => {
      onUpdate(file.clientUploadId, {
        progress: 0,
        errorMessage: undefined,
        canResume: false,
      });
      presignRef.current.delete(file.clientUploadId);
      await start(file);
    },
    [onUpdate, start],
  );

  const pause = useCallback(
    async (clientUploadId: string) => {
      const request = requestsRef.current.get(clientUploadId);
      if (!request) return;
      request.abort();
      requestsRef.current.delete(clientUploadId);
      onUpdate(clientUploadId, {
        status: "failed",
        errorMessage:
          "Pause is unavailable for presigned S3 PUT uploads. Retry will start a new upload.",
        canResume: false,
      });
    },
    [onUpdate],
  );

  const resume = useCallback(
    async (file: UploadQueueFile) => {
      await retry(file);
    },
    [retry],
  );

  const cancelLocal = useCallback(async (clientUploadId: string) => {
    const request = requestsRef.current.get(clientUploadId);
    if (request) {
      request.abort();
      requestsRef.current.delete(clientUploadId);
    }
    presignRef.current.delete(clientUploadId);
  }, []);

  return {
    start,
    pause,
    resume,
    retry,
    cancelLocal,
  };
}

function putToS3({
  file,
  presign,
  onProgress,
  onRequest,
}: {
  file: UploadQueueFile;
  presign: PresignUploadResponse;
  onProgress: (progress: number) => void;
  onRequest: (request: XMLHttpRequest) => void;
}) {
  if (!file.file) {
    return Promise.reject(new Error("No local file is attached."));
  }

  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    onRequest(request);

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress((event.loaded / event.total) * 100);
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }
      reject(
        new Error(
          request.responseText ||
            `S3 upload failed with status ${request.status}.`,
        ),
      );
    };

    request.onerror = () => reject(new Error("S3 upload failed."));
    request.onabort = () =>
      reject(
        new Error(
          "S3 upload was cancelled. Presigned PUT uploads cannot resume; retry will request a new upload URL.",
        ),
      );

    request.open(presign.method || "PUT", presign.uploadUrl);
    if (file.contentType) {
      request.setRequestHeader("Content-Type", file.contentType);
    }
    request.send(file.file);
  });
}
