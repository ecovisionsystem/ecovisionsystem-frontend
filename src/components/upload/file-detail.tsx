"use client";

import Link from "next/link";
import { Play, RefreshCcw, Trash2 } from "lucide-react";
import { formatBytes, statusMeta, uploadTheme as T } from "./upload-utils";
import type { UploadMetadata, UploadQueueFile } from "./upload-types";

interface FileDetailProps {
  file: UploadQueueFile | undefined;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
  onStart?: (file: UploadQueueFile) => void;
  onPause?: (clientUploadId: string) => void;
  onResume?: (file: UploadQueueFile) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
}

export function FileDetail({ file, onMetadataChange, onStart, onRetry, onRemove }: FileDetailProps) {
  if (!file) return <aside className="flex min-h-[640px] items-center justify-center rounded-2xl bg-white text-sm text-text-secondary">Select a file to inspect it.</aside>;
  const status = statusMeta[file.status];
  const editable = file.status === "selected";
  const setMetadata = (patch: Partial<UploadMetadata>) => onMetadataChange?.(file.clientUploadId, { ...file.metadata, ...patch });
  return <aside className="min-h-[640px] rounded-2xl bg-white p-7">
    <div className="flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: T.border }}><div><h2 className="break-all text-base font-semibold">{file.name}</h2><p className="mt-1 text-xs text-text-secondary">{formatBytes(file.size)} · {file.contentType}</p></div><span className="rounded-full px-2 py-1 text-xs" style={{ color: status.color, background: status.bg }}>{status.label}</span></div>
    <div className="mt-6 space-y-5">
      <section><h3 className="mb-3 text-sm font-semibold">Upload metadata</h3><div className="grid gap-3 sm:grid-cols-2">{[["Site name", "siteName"], ["Survey name", "surveyName"], ["CRS", "crs"], ["Ground sample distance", "gsd"]].map(([label, key]) => <label key={key} className="text-xs text-text-secondary">{label}<input disabled={!editable} value={(file.metadata as Record<string, string | undefined>)[key] || ""} onChange={(e) => setMetadata({ [key]: e.target.value })} className="mt-1 w-full rounded-md border border-border p-2 text-sm text-text-primary disabled:bg-surface-overlay" /></label>)}</div></section>
      <section><h3 className="mb-3 text-sm font-semibold">Persistent identifiers</h3><dl className="space-y-2 text-sm">{[["Upload ID", file.uploadId], ["Job ID", file.jobId]].map(([label, value]) => <div key={label} className="flex gap-4"><dt className="w-24 text-text-secondary">{label}</dt><dd className="break-all font-mono text-xs">{value || "Not assigned"}</dd></div>)}</dl></section>
      {file.errorMessage && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{file.errorMessage}</p>}
      <div className="flex flex-wrap gap-2">{file.status === "selected" && <button onClick={() => onStart?.(file)} className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2 text-sm text-white"><Play className="h-4 w-4" />Upload</button>}{file.status === "failed" && <button onClick={() => onRetry?.(file)} className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2 text-sm text-white"><RefreshCcw className="h-4 w-4" />Retry</button>}{file.jobId && <Link href={`/results/${file.jobId}`} className="rounded-md border border-border px-4 py-2 text-sm">View result</Link>}{file.status !== "uploading" && file.status !== "uploaded" && <button onClick={() => onRemove?.(file.id)} className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm text-red-700"><Trash2 className="h-4 w-4" />Remove</button>}</div>
      {file.jobId && file.status === "uploaded" && <p className="text-sm text-text-secondary">The upload is queued for inference. Result and progress data will appear through the job API.</p>}
    </div>
  </aside>;
}
