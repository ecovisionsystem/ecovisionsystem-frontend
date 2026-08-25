"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  FileImage,
  ImageIcon,
  Play,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";
import { AnalysisStatus } from "@/components/analysis/analysis-status";
import { Button } from "@/components/ui/button";
import { useJob } from "@/hooks/useAnalysisQueries";
import { shortJobReference } from "@/lib/analysis";
import { formatBytes, statusMeta, uploadTheme as T } from "./upload-utils";
import { UploadImage, type EnsureUploadPreview } from "./upload-image";
import type {
  UploadMetadata,
  UploadQueueFile,
  UploadTab,
} from "./upload-types";

interface FileDetailProps {
  file: UploadQueueFile | undefined;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
  onStart?: (file: UploadQueueFile) => void;
  onCancelUpload?: (clientUploadId: string) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
  onPreviewNeeded?: EnsureUploadPreview;
  onRunAnalysis?: (file: UploadQueueFile) => void;
  analysisSubmitting?: boolean;
  analysisError?: string;
}

const tabs: Array<{ id: UploadTab; label: string }> = [
  { id: "meta", label: "Metadata" },
  { id: "analysis", label: "Analysis" },
  { id: "results", label: "Results" },
];

export function FileDetail({
  file,
  onMetadataChange,
  onStart,
  onCancelUpload,
  onRetry,
  onRemove,
  onPreviewNeeded,
  onRunAnalysis,
  analysisSubmitting = false,
  analysisError,
}: FileDetailProps) {
  const [tab, setTab] = useState<UploadTab>("analysis");

  useEffect(() => setTab("analysis"), [file?.id]);

  if (!file) {
    return (
      <aside className="flex min-h-[640px] items-center justify-center rounded-2xl bg-white p-8 text-center">
        <div>
          <FileImage className="mx-auto h-10 w-10 text-text-muted" />
          <p className="mt-3 text-sm text-text-secondary">
            Select imagery to inspect its metadata and analysis state.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl bg-white">
      <header className="shrink-0 px-6 pt-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-lg bg-brand-muted p-2 text-brand-primary">
            <FileImage className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="break-all text-sm font-semibold text-text-primary">
              {file.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
              <span>{formatBytes(file.size)}</span>
              <span aria-hidden="true">·</span>
              <span>{statusMeta[file.status].label}</span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-border" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className="-mb-px border-b-2 px-3 py-2 text-sm"
              style={{
                color: tab === item.id ? T.ink : T.muted,
                borderColor: tab === item.id ? T.moss : "transparent",
                fontWeight: tab === item.id ? 600 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {tab === "meta" && (
          <MetadataTab
            file={file}
            onMetadataChange={onMetadataChange}
            onPreviewNeeded={onPreviewNeeded}
          />
        )}
        {tab === "analysis" && (
          <AnalysisTab
            file={file}
            onStart={onStart}
            onCancelUpload={onCancelUpload}
            onRetry={onRetry}
            onRemove={onRemove}
            onRunAnalysis={onRunAnalysis}
            submitting={analysisSubmitting}
            error={analysisError}
          />
        )}
        {tab === "results" && <ResultsTab file={file} />}
      </div>
    </aside>
  );
}

function MetadataTab({
  file,
  onMetadataChange,
  onPreviewNeeded,
}: {
  file: UploadQueueFile;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
  onPreviewNeeded?: EnsureUploadPreview;
}) {
  const updateField = (field: keyof UploadMetadata, value: string) =>
    onMetadataChange?.(file.clientUploadId, {
      ...file.metadata,
      [field]: value,
    });
  const editable = file.status === "selected" && Boolean(onMetadataChange);

  return (
    <div className="space-y-5">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-overlay">
        <UploadImage file={file} onPreviewNeeded={onPreviewNeeded} eager />
      </div>

      <DetailGroup
        title="File"
        items={[
          ["Filename", file.name],
          ["Size", formatBytes(file.size)],
          ["Format", file.contentType],
          ["Dimensions", file.dims],
          ["Upload status", statusMeta[file.status].label],
        ]}
      />

      <section>
        <SectionLabel>Survey metadata</SectionLabel>
        <div className="space-y-3">
          <MetadataInput
            label="Survey name"
            value={file.metadata.surveyName || ""}
            onChange={(value) => updateField("surveyName", value)}
            disabled={!editable}
          />
          <MetadataInput
            label="Site"
            value={file.metadata.siteName || ""}
            onChange={(value) => updateField("siteName", value)}
            disabled={!editable}
          />
          <MetadataInput
            label="Capture date"
            type="date"
            value={file.metadata.captureDate || ""}
            onChange={(value) => updateField("captureDate", value)}
            disabled={!editable}
          />
          <MetadataInput
            label="CRS"
            value={file.metadata.crs || ""}
            onChange={(value) => updateField("crs", value)}
            disabled={!editable}
          />
          <MetadataInput
            label="GSD"
            value={file.metadata.gsd || ""}
            onChange={(value) => updateField("gsd", value)}
            disabled={!editable}
          />
        </div>
        {!editable && (
          <p className="mt-3 text-xs text-text-muted">
            Metadata is locked after upload registration.
          </p>
        )}
      </section>
    </div>
  );
}

function AnalysisTab({
  file,
  onStart,
  onCancelUpload,
  onRetry,
  onRemove,
  onRunAnalysis,
  submitting,
  error,
}: {
  file: UploadQueueFile;
  onStart?: (file: UploadQueueFile) => void;
  onCancelUpload?: (clientUploadId: string) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
  onRunAnalysis?: (file: UploadQueueFile) => void;
  submitting: boolean;
  error?: string;
}) {
  const jobQuery = useJob(file.jobId);

  if (file.status !== "uploaded") {
    return (
      <UploadState
        file={file}
        onStart={onStart}
        onCancelUpload={onCancelUpload}
        onRetry={onRetry}
        onRemove={onRemove}
      />
    );
  }

  if (file.jobId) {
    return (
      <div className="space-y-4">
        {jobQuery.data ? (
          <AnalysisStatus status={jobQuery.data.status} />
        ) : jobQuery.isLoading ? (
          <p className="text-sm text-text-secondary">Loading analysis state…</p>
        ) : (
          <ErrorNotice message="Analysis state is temporarily unavailable." />
        )}
        <p className="text-xs text-text-muted">
          Reference: {shortJobReference(file.jobId)}
        </p>
        <Link
          href={`/results/${file.jobId}`}
          className="flex h-10 w-full items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-semibold text-white"
        >
          View analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-success/20 bg-success-bg p-4">
        <h4 className="font-semibold text-text-primary">Ready for analysis</h4>
        <p className="mt-2 text-sm text-text-secondary">
          EcoVision can analyse this image for:
        </p>
        <ul className="mt-3 space-y-1 text-sm italic text-text-primary">
          <li>Spartina maritima</li>
          <li>Puccinellia maritima</li>
        </ul>
      </div>

      {error && <ErrorNotice message={error} />}

      <Button
        type="button"
        className="w-full"
        loading={submitting}
        disabled={!file.uploadId || !onRunAnalysis}
        onClick={() => onRunAnalysis?.(file)}
      >
        {submitting ? "Submitting…" : "Run Analysis"}
      </Button>
    </div>
  );
}

function ResultsTab({ file }: { file: UploadQueueFile }) {
  const jobQuery = useJob(file.jobId);

  if (!file.jobId) {
    return (
      <div className="py-12 text-center">
        <ImageIcon className="mx-auto h-9 w-9 text-text-muted" />
        <p className="mt-3 text-sm font-medium text-text-primary">Not analysed</p>
        <p className="mt-1 text-xs text-text-secondary">
          Run analysis from the Analysis tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobQuery.data ? (
        <AnalysisStatus status={jobQuery.data.status} />
      ) : jobQuery.isLoading ? (
        <p className="text-sm text-text-secondary">Loading analysis state…</p>
      ) : (
        <ErrorNotice message="Analysis state is temporarily unavailable." />
      )}
      <Link
        href={`/results/${file.jobId}`}
        className="flex h-10 w-full items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-semibold text-white"
      >
        View full analysis result
      </Link>
    </div>
  );
}

function UploadState({
  file,
  onStart,
  onCancelUpload,
  onRetry,
  onRemove,
}: {
  file: UploadQueueFile;
  onStart?: (file: UploadQueueFile) => void;
  onCancelUpload?: (clientUploadId: string) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
}) {
  const busy = ["registering", "pending", "uploading"].includes(file.status);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface-overlay p-4">
        <div className="flex justify-between text-sm">
          <span>{statusMeta[file.status].label}</span>
          <span>{file.progress.toFixed(0)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded bg-white">
          <div
            className="h-full rounded bg-brand-primary transition-[width]"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      </div>

      {file.errorMessage && <ErrorNotice message={file.errorMessage} />}

      {(file.status === "selected" || file.status === "ready") && (
        <Button className="w-full" onClick={() => onStart?.(file)}>
          <Play className="h-4 w-4" /> Start upload
        </Button>
      )}
      {file.status === "uploading" && (
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => onCancelUpload?.(file.clientUploadId)}
          disabled={!onCancelUpload}
        >
          <X className="h-4 w-4" /> Cancel Upload
        </Button>
      )}
      {file.status === "failed" && (
        <Button className="w-full" onClick={() => onRetry?.(file)}>
          <RefreshCcw className="h-4 w-4" /> Retry upload
        </Button>
      )}
      {!busy && file.status !== "uploaded" && (
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => onRemove?.(file.id)}
        >
          <Trash2 className="h-4 w-4" /> Remove from view
        </Button>
      )}
    </div>
  );
}

function MetadataInput({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-text-primary disabled:bg-surface-overlay"
      />
    </label>
  );
}

function DetailGroup({
  title,
  items,
}: {
  title: string;
  items: string[][];
}) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <dl className="overflow-hidden rounded-xl border border-border">
        {items.map(([label, value]) => (
          <div key={label} className="flex gap-3 border-b border-border px-3 py-2 last:border-0">
            <dt className="w-24 shrink-0 text-xs text-text-secondary">{label}</dt>
            <dd className="break-all text-xs text-text-primary">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </h4>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="flex gap-2 rounded-lg border border-error/20 bg-error-bg p-3 text-sm text-error">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
