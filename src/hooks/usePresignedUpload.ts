"use client";

import { useCallback, useRef } from "react";
import {
  completeUpload,
  presignUpload,
  retryUpload as requestUploadRetry,
} from "@/lib/uploads";
import type {
  CompleteUploadResponse,
  PresignUploadResponse,
  UploadQueueFile,
} from "@/components/upload/upload-types";

interface UsePresignedUploadOptions {
  projectId?: string;
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
  accessToken,
  onUpdate,
  onUploaded,
}: UsePresignedUploadOptions) {
  const requestsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const cancelledRef = useRef<Set<string>>(new Set());

  const transfer = useCallback(
    async (file: UploadQueueFile, presign: PresignUploadResponse) => {
      onUpdate(file.clientUploadId, {
        status: "pending",
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
        onProgress: (progress) =>
          onUpdate(file.clientUploadId, { status: "uploading", progress }),
        onRequest: (request) =>
          requestsRef.current.set(file.clientUploadId, request),
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
    },
    [accessToken, onUpdate, onUploaded],
  );

  const handleFailure = useCallback(
    (file: UploadQueueFile, error: unknown) => {
      requestsRef.current.delete(file.clientUploadId);
      if (cancelledRef.current.delete(file.clientUploadId)) {
        onUpdate(file.clientUploadId, {
          status: "cancelled",
          errorMessage: undefined,
          canResume: false,
        });
        return;
      }
      onUpdate(file.clientUploadId, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Upload failed.",
        canResume: false,
      });
    },
    [onUpdate],
  );

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
      if (!activeProjectId || !accessToken) {
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage: !activeProjectId
            ? "Project context is required before uploading."
            : "You must be signed in before uploading files.",
        });
        return;
      }

      try {
        onUpdate(file.clientUploadId, {
          status: "registering",
          progress: 0,
          errorMessage: undefined,
        });
        const presign = await presignUpload(
          {
            filename: file.name,
            contentType: file.contentType || "application/octet-stream",
            fileSize: file.size,
            projectId: activeProjectId,
            metadata: { ...file.metadata },
          },
          accessToken,
        );
        await transfer(file, presign);
      } catch (error) {
        handleFailure(file, error);
      }
    },
    [accessToken, handleFailure, onUpdate, projectId, transfer],
  );

  const retry = useCallback(
    async (file: UploadQueueFile) => {
      if (!file.uploadId) {
        await start(file);
        return;
      }
      if (!file.file || !accessToken) {
        onUpdate(file.clientUploadId, {
          status: "failed",
          errorMessage: !file.file
            ? "Select the local file again before retrying."
            : "You must be signed in before retrying.",
        });
        return;
      }

      try {
        onUpdate(file.clientUploadId, {
          status: "registering",
          progress: 0,
          errorMessage: undefined,
        });
        const presign = await requestUploadRetry(file.uploadId, accessToken);
        await transfer(file, presign);
      } catch (error) {
        handleFailure(file, error);
      }
    },
    [accessToken, handleFailure, onUpdate, start, transfer],
  );

  const cancelActive = useCallback((clientUploadId: string) => {
    const request = requestsRef.current.get(clientUploadId);
    if (!request) return;
    cancelledRef.current.add(clientUploadId);
    request.abort();
    requestsRef.current.delete(clientUploadId);
  }, []);

  const cancelLocal = useCallback((clientUploadId: string) => {
    const request = requestsRef.current.get(clientUploadId);
    if (request) {
      cancelledRef.current.add(clientUploadId);
      request.abort();
      requestsRef.current.delete(clientUploadId);
    }
  }, []);

  return { start, retry, cancelActive, cancelLocal };
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
  if (!file.file) return Promise.reject(new Error("No local file is attached."));

  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    onRequest(request);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress((event.loaded / event.total) * 100);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(request.responseText || `Upload failed with status ${request.status}.`));
    };
    request.onerror = () => reject(new Error("Upload failed."));
    request.onabort = () => reject(new Error("Upload cancelled."));
    request.open(presign.method || "PUT", presign.uploadUrl);
    request.send(file.file);
  });
}
