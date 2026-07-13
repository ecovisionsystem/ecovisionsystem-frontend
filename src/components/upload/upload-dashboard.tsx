"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { filesToQueueItems, uploadTheme as T } from "./upload-utils";
import { DropZone } from "./drop-zone";
import { FileDetail } from "./file-detail";
import { StatusBar } from "./status-bar";
import { UploadQueue } from "./upload-queue";
import { useAuth } from "@/hooks/useAuth";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { listProjectUploads } from "@/lib/uploads";
import type {
  ProjectUpload,
  UploadMetadata,
  UploadQueueFile,
  UploadStatus,
} from "./upload-types";

interface UploadDashboardProps {
  projectId?: string;
  projectName?: string;
  initialUploadedFiles?: UploadQueueFile[];
}

export function UploadDashboard({
  projectId,
  projectName,
  initialUploadedFiles,
}: UploadDashboardProps) {
  const { apiToken } = useAuth();
  const initialFiles = initialUploadedFiles ?? [];
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const [files, setFiles] = useState<UploadQueueFile[]>(
    initialFiles,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialFiles[0]?.id ?? null,
  );

  const updateFile = useCallback(
    (clientUploadId: string, patch: Partial<UploadQueueFile>) => {
      setFiles((current) =>
        current.map((file) =>
          file.clientUploadId === clientUploadId ? { ...file, ...patch } : file,
        ),
      );
    },
    [],
  );

  const hasProjectContext = Boolean(projectId);

  const refreshProjectUploads = useCallback(async () => {
    if (!projectId || !apiToken) return;

    try {
      const uploads = await listProjectUploads(projectId, apiToken);
      setFiles((current) => mergeProjectUploads(current, uploads, projectId));
    } catch (error) {
      console.error("Failed to load project uploads:", error);
    }
  }, [apiToken, projectId]);

  const uploadController = usePresignedUpload({
    projectId,
    accessToken: apiToken,
    onUpdate: updateFile,
    onUploaded: refreshProjectUploads,
  });

  useEffect(() => {
    void refreshProjectUploads();
  }, [refreshProjectUploads]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  const addFiles = useCallback((rawFiles: File[]) => {
    const newFiles = filesToQueueItems(rawFiles, projectId).map((file) => ({
      ...file,
      previewUrl: createPreviewUrl(file.file),
    }));
    newFiles.forEach((file) => {
      if (file.previewUrl?.startsWith("blob:")) {
        previewUrlsRef.current.add(file.previewUrl);
      }
    });
    setFiles((current) => [...current, ...newFiles]);
    if (newFiles.length) setSelectedId(newFiles[0].id);
  }, [projectId]);

  const removeFile = useCallback(
    async (id: string) => {
      const fileToRemove = files.find((file) => file.id === id);
      const nextSelectedId = files.find((file) => file.id !== id)?.id ?? null;
      if (fileToRemove) {
        await uploadController.cancelLocal(fileToRemove.clientUploadId);
      }
      if (fileToRemove?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
        previewUrlsRef.current.delete(fileToRemove.previewUrl);
      }
      setFiles((current) => current.filter((file) => file.id !== id));
      if (selectedId === id) setSelectedId(nextSelectedId);
    },
    [files, selectedId, uploadController],
  );

  const updateMetadata = useCallback(
    (clientUploadId: string, metadata: UploadMetadata) => {
      updateFile(clientUploadId, { metadata });
    },
    [updateFile],
  );

  const startUpload = useCallback(
    async (file: UploadQueueFile) => {
      if (!hasProjectContext) {
        updateFile(file.clientUploadId, {
          status: "failed",
          errorMessage:
            "Open or create a project before uploading to S3. The legacy upload page is preview-only.",
        });
        return;
      }

      await uploadController.start(file);
    },
    [hasProjectContext, updateFile, uploadController],
  );

  const activeFile = useMemo(
    () => files.find((file) => file.id === selectedId),
    [files, selectedId],
  );

  const uploadedFiles = files.filter((file) => file.status === "uploaded");
  const showProjectGallery = hasProjectContext || Boolean(projectName);

  return (
    <div className="relative p-6">
      <style>{uploadDashboardCss}</style>
      {projectName && (
        <div className="px-1 pb-4">
          <p className="text-sm text-text-secondary">Project workspace</p>
          <h2 className="text-xl font-semibold text-text-primary">
            {projectName}
          </h2>
        </div>
      )}
      <div className="overflow-hidden  " style={{ fontFamily: T.sans }}>
        <div className="grid min-h-[680px] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <UploadQueue
            files={files}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRemove={removeFile}
            onFiles={addFiles}
          />

          <main className="flex min-h-[640px] flex-col gap-5 overflow-y-auto p-7">
            <DropZone onFiles={addFiles} />

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[9px] uppercase tracking-[1px]"
                style={{ fontFamily: T.mono, color: T.muted }}
              >
                Accepted
              </span>
              {[
                ".tif / GeoTIFF",
                ".tiff",
                ".png",
                ".jpg",
                ".jpeg",
                "GeoTIFF + WorldFile",
              ].map((format) => (
                <span
                  key={format}
                  className="rounded-full border px-2 py-1 text-[9px]"
                  style={{
                    fontFamily: T.mono,
                    color: T.inkSoft,
                    background: T.border,
                    borderColor: T.border,
                  }}
                >
                  {format}
                </span>
              ))}
            </div>

            <SelectedPreview file={activeFile} />
          </main>

          <div style={{ borderColor: T.border }}>
            <FileDetail
              file={activeFile}
              onMetadataChange={updateMetadata}
              onStart={startUpload}
              onRetry={uploadController.retry}
              onRemove={removeFile}
            />
          </div>
        </div>
      </div>
      {showProjectGallery && (
        <ProjectImageGallery
          files={uploadedFiles}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      <StatusBar files={files} />
    </div>
  );
}

function SelectedPreview({ file }: { file?: UploadQueueFile }) {
  if (!file) return null;

  return (
    <section>
      <div
        className="mb-3 text-[9px] uppercase tracking-[1.5px]"
        style={{ fontFamily: T.mono, color: T.muted }}
      >
        Selected Preview
      </div>
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: T.border, background: T.paper }}
      >
        <ImagePreview file={file} aspectClassName="aspect-[16/9]" />
      </div>
    </section>
  );
}

function ProjectImageGallery({
  files,
  selectedId,
  onSelect,
}: {
  files: UploadQueueFile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: T.border }}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[9px] uppercase tracking-[1.5px]"
            style={{ fontFamily: T.mono, color: T.muted }}
          >
            Project Gallery
          </div>
          <h3 className="mt-1 text-base font-semibold" style={{ color: T.ink }}>
            Uploaded imagery
          </h3>
        </div>
        <span className="text-xs" style={{ color: T.muted }}>
          {files.length} uploaded files
        </span>
      </div>

      {files.length === 0 ? (
        <div
          className="flex min-h-36 items-center justify-center rounded-xl border border-dashed text-sm"
          style={{ borderColor: T.border, color: T.muted, background: T.paper }}
        >
          Uploaded project imagery will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => onSelect(file.id)}
              className="overflow-hidden rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: selectedId === file.id ? T.moss : "transparent",
                background: T.paper,
                boxShadow:
                  selectedId === file.id
                    ? "0 0 0 3px rgba(43,77,14,0.15)"
                    : "none",
              }}
            >
              <ImagePreview file={file} aspectClassName="aspect-[4/3]" />
              <div className="space-y-1 px-3 py-3">
                <div className="truncate text-sm font-semibold" style={{ color: T.ink }}>
                  {file.name}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px]" style={{ fontFamily: T.mono, color: T.muted }}>
                  <span>{file.metadata.siteName || "Project upload"}</span>
                  <span>GSD {file.metadata.gsd || file.gsd}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ImagePreview({
  file,
  aspectClassName,
}: {
  file: UploadQueueFile;
  aspectClassName: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const canRenderImage = Boolean(file.previewUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [file.previewUrl]);

  return (
    <div
      className={`relative overflow-hidden ${aspectClassName}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(14,20,9,1), rgba(43,77,14,0.92), rgba(74,184,212,0.22))",
      }}
    >
      {canRenderImage ? (
        <img
          src={file.previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="h-full w-full opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 28% 30%, rgba(154,224,83,0.4) 0, transparent 24%), radial-gradient(circle at 78% 55%, rgba(74,184,212,0.28) 0, transparent 20%), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 28px 28px, 28px 28px",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <div
          className="text-[7px] tracking-wide"
          style={{ fontFamily: T.mono, color: T.lime }}
        >
          {file.status === "uploaded" ? "UPLOADED" : "SELECTED"}
        </div>
        <div className="truncate text-[10px] text-white/85">{file.name}</div>
      </div>
      <div
        className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[7px] tracking-wide"
        style={{
          fontFamily: T.mono,
          background: "rgba(0,0,0,0.55)",
          color: T.lime,
        }}
      >
        {canRenderImage ? "IMAGE" : file.bands}
      </div>
    </div>
  );
}

function createPreviewUrl(file?: File) {
  if (!file || !isPreviewCandidate(file)) return undefined;
  return URL.createObjectURL(file);
}

function isPreviewCandidate(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type.startsWith("image/") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".tif") ||
    name.endsWith(".tiff")
  );
}

function mergeProjectUploads(
  currentFiles: UploadQueueFile[],
  uploads: ProjectUpload[],
  projectId: string,
) {
  const backendFiles = uploads.map((upload) =>
    projectUploadToQueueFile(upload, projectId),
  );
  const backendByUploadId = new Map(
    backendFiles.map((file) => [file.uploadId, file]),
  );
  const usedUploadIds = new Set<string>();
  const merged: UploadQueueFile[] = [];

  currentFiles.forEach((file) => {
    const backendFile = file.uploadId
      ? backendByUploadId.get(file.uploadId)
      : undefined;

    if (backendFile) {
      usedUploadIds.add(file.uploadId as string);
      merged.push({
        ...backendFile,
        ...file,
        status: normalizeUploadStatus(backendFile.status),
        jobId: backendFile.jobId,
        progress: 100,
      });
      return;
    }

    if (file.source !== "backend") {
      merged.push(file);
    }
  });

  backendFiles.forEach((file) => {
    if (!file.uploadId || usedUploadIds.has(file.uploadId)) return;
    merged.push(file);
  });

  return merged;
}

function projectUploadToQueueFile(
  upload: ProjectUpload,
  projectId: string,
): UploadQueueFile {
  const status = normalizeUploadStatus(upload.status);

  return {
    id: upload.id,
    clientUploadId: upload.id,
    projectId,
    uploadId: upload.id,
    jobId: upload.jobId || undefined,
    metadata: {},
    errorMessage: undefined,
    canResume: false,
    source: "backend",
    name: upload.filename,
    size: upload.fileSize,
    contentType: upload.contentType,
    gsd: "-",
    crs: "-",
    bands: upload.filename.toLowerCase().includes("_ms") ? "MS-5" : "RGB",
    dims: "-",
    lat: "-",
    lng: "-",
    status,
    progress: status === "uploaded" ? 100 : 0,
  };
}

function normalizeUploadStatus(status: string): UploadStatus {
  if (
    status === "selected" ||
    status === "registering" ||
    status === "pending" ||
    status === "ready" ||
    status === "uploading" ||
    status === "paused" ||
    status === "uploaded" ||
    status === "failed" ||
    status === "cancelled"
  ) {
    return status;
  }
  return status === "complete" || status === "completed" ? "uploaded" : "pending";
}

function inferContentType(filename: string) {
  const name = filename.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".tif") || name.endsWith(".tiff")) return "image/tiff";
  return "application/octet-stream";
}

const uploadDashboardCss = `
@keyframes uploadPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.75); }
}

@keyframes uploadShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes uploadSpinRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
