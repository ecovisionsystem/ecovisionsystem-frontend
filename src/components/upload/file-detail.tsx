"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Cloud,
  Download,
  ImageIcon,
  Pause,
  Play,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatBytes, statusMeta, uploadTheme as T } from "./upload-utils";
import { FileTypeIcon } from "./file-card";
import type {
  UploadMetadata,
  UploadQueueFile,
  UploadTab,
} from "./upload-types";

interface FileDetailProps {
  file: UploadQueueFile | undefined;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
  onStart?: (file: UploadQueueFile) => void;
  onPause?: (clientUploadId: string) => void;
  onResume?: (file: UploadQueueFile) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
}

const tabs: Array<{ id: UploadTab; label: string }> = [
  { id: "meta", label: "Metadata" },
  { id: "inference", label: "Inference" },
  { id: "results", label: "Results" },
];

export function FileDetail({
  file,
  onMetadataChange,
  onStart,
  onPause,
  onResume,
  onRetry,
  onRemove,
}: FileDetailProps) {
  const [tab, setTab] = useState<UploadTab>("inference");

  useEffect(() => {
    setTab("inference");
  }, [file?.id]);

  if (!file) return <EmptyDetail />;

  const status = statusMeta[file.status];

  return (
    <aside className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl bg-white">
      <div className="shrink-0 px-7 pt-6">
        <div className="mb-5 flex items-start gap-4">
          <FileTypeIcon type={file.bands} />
          <div className="min-w-0 flex-1">
            <div
              className="break-all text-sm font-bold leading-snug"
              style={{ color: T.ink }}
            >
              {file.name}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                style={{
                  fontFamily: T.mono,
                  color: status.color,
                  background: status.bg,
                }}
              >
                {status.label}
              </span>
              <span
                className="text-[10px]"
                style={{ fontFamily: T.mono, color: T.muted }}
              >
                {formatBytes(file.size)}
              </span>
              <span
                className="text-[10px]"
                style={{ fontFamily: T.mono, color: T.muted }}
              >
                {file.dims}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b" style={{ borderColor: T.border }}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className="-mb-px border-b-2 px-4 py-2 text-[13px] transition-colors"
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
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5">
        {tab === "meta" && (
          <MetaTab file={file} onMetadataChange={onMetadataChange} />
        )}
        {tab === "inference" && (
          <InferenceTab
            file={file}
            onStart={onStart}
            onPause={onPause}
            onResume={onResume}
            onRetry={onRetry}
            onRemove={onRemove}
          />
        )}
        {tab === "results" && <ResultsTab file={file} />}
      </div>
    </aside>
  );
}

function MetaTab({
  file,
  onMetadataChange,
}: {
  file: UploadQueueFile;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
}) {
  const groups = [
    {
      group: "File",
      items: [
        ["Filename", file.name],
        ["Size", formatBytes(file.size)],
        ["Content Type", file.contentType],
        ["Bands", file.bands],
        ["Dimensions", file.dims],
      ],
    },
    {
      group: "Spatial",
      items: [
        ["Coordinate System", file.metadata.crs || file.crs],
        ["Latitude", file.lat],
        ["Longitude", file.lng],
        ["GSD", file.metadata.gsd || file.gsd],
      ],
    },
    {
      group: "Pipeline",
      items: [
        ["Status", statusMeta[file.status].label],
        ["S3 Upload", file.uploadId ? "Presigned PUT / Registered" : "Pending"],
        ["Upload ID", file.uploadId || "-"],
        ["Job ID", file.jobId || "-"],
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <PreviewPanel file={file} />

      {groups.map((group) => (
        <div key={group.group}>
          <SectionLabel>{group.group}</SectionLabel>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ background: T.paper, borderColor: T.border }}
          >
            {group.items.map(([key, value], index) => (
              <div
                key={key}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{
                  borderBottom:
                    index < group.items.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                }}
              >
                <span
                  className="w-28 shrink-0 text-xs"
                  style={{ color: T.muted }}
                >
                  {key}
                </span>
                <span
                  className="break-all text-[11px]"
                  style={{ fontFamily: T.mono, color: T.ink }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <UploadMetadataComparison
        file={file}
        onMetadataChange={onMetadataChange}
      />
    </div>
  );
}

function InferenceTab({
  file,
  onStart,
  onPause,
  onResume,
  onRetry,
  onRemove,
}: {
  file: UploadQueueFile;
  onStart?: (file: UploadQueueFile) => void;
  onPause?: (clientUploadId: string) => void;
  onResume?: (file: UploadQueueFile) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(-1);
  const [overlayOn, setOverlayOn] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const isUploaded = file.status === "uploaded";

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setRunning(false);
    setProgress(0);
    setStep(-1);
    setOverlayOn(false);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [file.id]);

  const runInferencePreview = () => {
    if (running || !isUploaded) return;

    setRunning(true);
    setProgress(0);
    setStep(0);

    let nextProgress = 0;
    const stages = [0, 22, 55, 78, 100];
    intervalRef.current = window.setInterval(() => {
      nextProgress = Math.min(nextProgress + 1.2, 100);
      setProgress(nextProgress);
      const nextStep = stages.findIndex((value) => nextProgress < value);
      setStep(nextStep === -1 ? 3 : Math.max(nextStep - 1, 0));

      if (nextProgress >= 100) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
        setStep(3);
      }
    }, 45);
  };

  const stages = [
    ["Tiling and normalisation", "512 x 512 tiles / mean-std normalisation"],
    ["SegFormer-B5 segmentation", "Mask generation / all classes"],
    ["ConvNeXt classification", "Blob-level species verification"],
    ["Dominance scoring", "Per-polygon ecological index"],
  ];

  return (
    <div className="space-y-5">
      <div
        className="rounded-[14px] border p-4"
        style={{ background: T.paper, borderColor: T.border }}
      >
        <SectionLabel>Model Configuration</SectionLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            ["Inference Type", "Select after upload"],
            ["Registration", file.uploadId ? "Registered" : "Pending upload"],
            ["Job", file.jobId || "Not started"],
            ["Delivery", "Aurora + S3 signed URL"],
          ].map(([key, value]) => (
            <div
              key={key}
              className="rounded-[10px] border bg-white px-3 py-2"
              style={{ borderColor: T.border }}
            >
              <div className="mb-1 text-[10px]" style={{ color: T.muted }}>
                {key}
              </div>
              <div
                className="break-all text-[11px] font-medium"
                style={{ fontFamily: T.mono, color: T.ink }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Pipeline Stages</SectionLabel>
        <div className="space-y-1">
          {stages.map(([label, detail], index) => {
            const done = step > index || (!running && isUploaded && file.jobId);
            const active = step === index && running;

            return (
              <div
                key={label}
                className="flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors"
                style={{
                  background: active ? "rgba(61,122,18,0.06)" : "transparent",
                  borderColor: active ? "rgba(61,122,18,0.15)" : "transparent",
                }}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: done ? T.lime : active ? T.leaf : T.border,
                    background: done ? T.lime : "transparent",
                    boxShadow: active ? `0 0 10px ${T.leaf}66` : "none",
                  }}
                >
                  {done && <Check className="h-3 w-3 text-white" />}
                  {active && (
                    <div
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{ background: T.leaf }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: done || active ? T.ink : T.muted }}
                  >
                    {label}
                  </div>
                  <div
                    className="mt-0.5 text-[9px]"
                    style={{ fontFamily: T.mono, color: T.muted }}
                  >
                    {detail}
                  </div>
                </div>
                {active && (
                  <div
                    className="text-[9px]"
                    style={{ fontFamily: T.mono, color: T.leaf }}
                  >
                    {progress.toFixed(0)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(running || (step >= 0 && isUploaded)) && (
        <div>
          <div className="mb-1.5 flex justify-between">
            <span
              className="text-[10px]"
              style={{ fontFamily: T.mono, color: T.muted }}
            >
              Overall progress
            </span>
            <span
              className="text-[10px]"
              style={{ fontFamily: T.mono, color: T.leaf }}
            >
              {running ? `${progress.toFixed(0)}%` : "100%"}
            </span>
          </div>
          <div className="h-1 rounded bg-black/10">
            <div
              className="h-full rounded transition-[width]"
              style={{
                width: running ? `${progress}%` : "100%",
                background: `linear-gradient(90deg,${T.leaf},${T.lime})`,
                animation:
                  running ? "uploadShimmer 1.5s ease-in-out infinite" : "none",
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={runInferencePreview}
        disabled={running || !isUploaded}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed"
        style={{
          color: isUploaded && !running ? "#fff" : T.muted,
          background: isUploaded && !running ? T.moss : T.warm,
          boxShadow: isUploaded && !running ? `0 4px 20px ${T.moss}33` : "none",
        }}
      >
        <Play className="h-4 w-4" />
        {running
          ? `Previewing inference... ${progress.toFixed(0)}%`
          : isUploaded
            ? "Select Model / Preview Stages"
            : "Upload required first"}
      </button>

      {isUploaded && (
        <label
          className="flex items-center justify-between rounded-[10px] border px-4 py-3"
          style={{ background: T.paper, borderColor: T.border }}
        >
          <span className="text-[13px]" style={{ color: T.ink }}>
            Show segmentation overlay
          </span>
          <input
            type="checkbox"
            checked={overlayOn}
            onChange={(event) => setOverlayOn(event.target.checked)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
        </label>
      )}

      <UploadControlsComparison
        file={file}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onRetry={onRetry}
        onRemove={onRemove}
      />
    </div>
  );
}

function ResultsTab({ file }: { file: UploadQueueFile }) {
  if (file.status !== "uploaded") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <ImageIcon className="h-10 w-10" style={{ color: T.muted }} />
        <div className="text-sm leading-relaxed" style={{ color: T.muted }}>
          Upload the image to make
          <br />
          inference results available.
        </div>
      </div>
    );
  }

  const species = [
    { name: "Spartina maritima", pct: 0.52, conf: 96.2, color: T.lime },
    { name: "Puccinellia maritima", pct: 0.31, conf: 93.8, color: T.leaf },
    { name: "Mixed / Ecotone", pct: 0.11, conf: 88.4, color: "#8CC840" },
    { name: "Bare substrate", pct: 0.06, conf: 97.2, color: T.warm },
  ];

  return (
    <div className="space-y-5">
      {file.jobId ? (
        <Link
          href={`/results/${file.jobId}`}
          className="flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white"
        >
          Open backend result page
        </Link>
      ) : (
        <div
          className="rounded-xl border p-4 text-sm"
          style={{ background: T.paper, borderColor: T.border, color: T.muted }}
        >
          This upload completed without a linked inference job. Results will
          appear here when the backend returns a job ID.
        </div>
      )}

      <div>
        <SectionLabel>Species Composition Preview</SectionLabel>
        <div className="space-y-2">
          {species.map((item) => (
            <div
              key={item.name}
              className="rounded-[10px] border px-4 py-3"
              style={{ background: T.paper, borderColor: T.border }}
            >
              <div className="mb-1.5 flex justify-between gap-3">
                <span className="text-xs italic" style={{ color: T.ink }}>
                  {item.name}
                </span>
                <div className="flex gap-3">
                  <span
                    className="text-[10px]"
                    style={{ fontFamily: T.mono, color: T.muted }}
                  >
                    {(item.pct * 100).toFixed(0)}%
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ fontFamily: T.mono, color: item.color }}
                  >
                    {item.conf.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1 rounded bg-black/10">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${item.pct * 100}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Ecological Metrics Preview</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Dominance Index", "Pending", T.lime],
            ["mIoU", "Pending", T.leaf],
            ["Pixel Accuracy", "Pending", T.lime],
            ["Blobs Detected", "Pending", T.leaf],
          ].map(([key, value, color]) => (
            <div
              key={key}
              className="rounded-[10px] border bg-white px-4 py-3"
              style={{ borderColor: T.border }}
            >
              <div className="mb-1 text-[10px]" style={{ color: T.muted }}>
                {key}
              </div>
              <div className="text-xl" style={{ fontFamily: T.serif, color }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Export</SectionLabel>
        <div className="space-y-2">
          {[
            ["GeoJSON - Species polygons", "Available after result processing"],
            ["Segmentation mask (GeoTIFF)", "Available after result processing"],
            ["Dominance score table (CSV)", "Available after result processing"],
            ["Inference report (PDF)", "Available after result processing"],
          ].map(([label, sub]) => (
            <button
              key={label}
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-[10px] border px-4 py-3 text-left opacity-70"
              style={{ background: T.paper, borderColor: T.border }}
            >
              <Download className="h-4 w-4" style={{ color: T.moss }} />
              <span className="flex-1">
                <span
                  className="block text-xs font-medium"
                  style={{ color: T.ink }}
                >
                  {label}
                </span>
                <span
                  className="mt-0.5 block text-[9px]"
                  style={{ fontFamily: T.mono, color: T.muted }}
                >
                  {sub}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <UploadObjectComparison file={file} />
    </div>
  );
}

function UploadMetadataComparison({
  file,
  onMetadataChange,
}: {
  file: UploadQueueFile;
  onMetadataChange?: (clientUploadId: string, metadata: UploadMetadata) => void;
}) {
  const updateField = (field: keyof UploadMetadata, value: string) => {
    onMetadataChange?.(file.clientUploadId, {
      ...file.metadata,
      [field]: value || undefined,
    });
  };

  return (
    <div>
      <SectionLabel>Upload Metadata</SectionLabel>
      <div
        className="space-y-3 rounded-xl border p-4"
        style={{ background: T.paper, borderColor: T.border }}
      >
        <MetadataInput
          label="Survey name"
          value={file.metadata.surveyName || ""}
          onChange={(value) => updateField("surveyName", value)}
          disabled={!onMetadataChange || file.status !== "selected"}
        />
        <MetadataInput
          label="Site name"
          value={file.metadata.siteName || ""}
          onChange={(value) => updateField("siteName", value)}
          disabled={!onMetadataChange || file.status !== "selected"}
        />
        <MetadataInput
          label="Capture date"
          type="date"
          value={file.metadata.captureDate || ""}
          onChange={(value) => updateField("captureDate", value)}
          disabled={!onMetadataChange || file.status !== "selected"}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetadataInput
            label="CRS"
            value={file.metadata.crs || ""}
            placeholder="EPSG:4326"
            onChange={(value) => updateField("crs", value)}
            disabled={!onMetadataChange || file.status !== "selected"}
          />
          <MetadataInput
            label="GSD"
            value={file.metadata.gsd || ""}
            placeholder="2.1cm"
            onChange={(value) => updateField("gsd", value)}
            disabled={!onMetadataChange || file.status !== "selected"}
          />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs" style={{ color: T.muted }}>
            Notes
          </span>
          <textarea
            value={file.metadata.notes || ""}
            onChange={(event) => updateField("notes", event.target.value)}
            disabled={!onMetadataChange || file.status !== "selected"}
            rows={3}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary disabled:opacity-60"
            style={{ borderColor: T.border, color: T.ink }}
          />
        </label>
      </div>
    </div>
  );
}

function UploadControlsComparison({
  file,
  onStart,
  onPause,
  onResume,
  onRetry,
  onRemove,
}: {
  file: UploadQueueFile;
  onStart?: (file: UploadQueueFile) => void;
  onPause?: (clientUploadId: string) => void;
  onResume?: (file: UploadQueueFile) => void;
  onRetry?: (file: UploadQueueFile) => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-[14px] border p-4"
        style={{ background: T.paper, borderColor: T.border }}
      >
        <SectionLabel>Upload Progress</SectionLabel>
        <div className="mb-2 flex justify-between">
          <span
            className="text-[10px]"
            style={{ fontFamily: T.mono, color: T.muted }}
          >
            {statusMeta[file.status].label}
          </span>
          <span
            className="text-[10px]"
            style={{ fontFamily: T.mono, color: T.leaf }}
          >
            {file.progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded bg-black/10">
          <div
            className="h-full rounded transition-[width]"
            style={{
              width: `${file.progress}%`,
              background: `linear-gradient(90deg,${T.blue},${T.lime})`,
              animation:
                file.status === "uploading"
                  ? "uploadShimmer 1.5s ease-in-out infinite"
                  : "none",
            }}
          />
        </div>
      </div>

      {file.errorMessage && (
        <div
          className="flex gap-3 rounded-xl border p-4 text-sm"
          style={{
            borderColor: "rgba(232,82,58,0.25)",
            background: "rgba(232,82,58,0.08)",
            color: T.red,
          }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{file.errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {(file.status === "selected" || file.status === "ready") && (
          <ActionButton
            icon={Play}
            label="Start upload"
            onClick={() => onStart?.(file)}
            primary
            disabled={!file.file || !onStart}
          />
        )}
        {file.status === "uploading" && (
          <ActionButton
            icon={Pause}
            label="Cancel active request"
            onClick={() => onPause?.(file.clientUploadId)}
            disabled={!onPause}
          />
        )}
        {file.status === "paused" && (
          <ActionButton
            icon={Play}
            label="Resume"
            onClick={() => onResume?.(file)}
            primary
            disabled={!onResume}
          />
        )}
        {file.status === "failed" && (
          <ActionButton
            icon={RefreshCcw}
            label="Retry"
            onClick={() => onRetry?.(file)}
            primary
            disabled={!onRetry}
          />
        )}
        {file.status !== "uploading" && file.status !== "uploaded" && (
          <ActionButton
            icon={Trash2}
            label="Remove"
            onClick={() => onRemove?.(file.id)}
            destructive
            disabled={!onRemove}
          />
        )}
      </div>

      <DetailGroup
        title="Upload Registration"
        items={[
          ["Project ID", file.projectId || "-"],
          ["Upload ID", file.uploadId || "-"],
          ["Job ID", file.jobId || "-"],
          ["Signed URL", file.uploadUrl ? "Issued" : "-"],
          ["Resume support", "Unavailable for presigned PUT"],
        ]}
      />
    </div>
  );
}

function UploadObjectComparison({ file }: { file: UploadQueueFile }) {
  return (
    <div className="space-y-5">
      {file.status === "uploaded" ? (
        <div
          className="flex items-center gap-3 rounded-xl border p-4"
          style={{
            borderColor: "rgba(108,192,42,0.2)",
            background: "rgba(108,192,42,0.08)",
            color: T.leaf,
          }}
        >
          <Check className="h-5 w-5" />
          <span className="text-sm font-medium">Upload complete</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border py-10 text-center">
          <Cloud className="h-10 w-10" style={{ color: T.muted }} />
          <div className="text-sm leading-relaxed" style={{ color: T.muted }}>
            The S3 object is registered
            <br />
            after the signed upload completes.
          </div>
        </div>
      )}

      <DetailGroup
        title="Backend Object Mapping"
        items={[
          ["Project ID", file.projectId || "-"],
          ["Upload ID", file.uploadId || "-"],
          ["Filename", file.name],
          ["Content Type", file.contentType],
          ["Job ID", file.jobId || "-"],
        ]}
      />
    </div>
  );
}

function DetailGroup({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: T.paper, borderColor: T.border }}
      >
        {items.map(([key, value], index) => (
          <div
            key={key}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{
              borderBottom:
                index < items.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span className="w-24 shrink-0 text-xs" style={{ color: T.muted }}>
              {key}
            </span>
            <span
              className="break-all text-[11px]"
              style={{ fontFamily: T.mono, color: T.ink }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetadataInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs" style={{ color: T.muted }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-brand-primary disabled:opacity-60"
        style={{ borderColor: T.border, color: T.ink }}
      />
    </label>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
  destructive,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        color: primary || destructive ? "#fff" : T.ink,
        background: destructive ? T.red : primary ? T.moss : T.paper,
        border: primary || destructive ? "none" : `1px solid ${T.border}`,
      }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function PreviewPanel({ file }: { file: UploadQueueFile }) {
  const [imageFailed, setImageFailed] = useState(false);
  const canRenderImage = Boolean(file.previewUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [file.previewUrl]);

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-[14px] border"
      style={{
        borderColor: T.border,
        background:
          "linear-gradient(135deg, rgba(14,20,9,1), rgba(43,77,14,0.95) 45%, rgba(74,184,212,0.22))",
      }}
    >
      {canRenderImage ? (
        <img
          src={file.previewUrl}
          alt={file.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(154,224,83,0.36) 0, transparent 22%), radial-gradient(circle at 75% 40%, rgba(74,184,212,0.28) 0, transparent 20%), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 34px 34px, 34px 34px",
          }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {[file.lat, file.lng, `GSD ${file.metadata.gsd || file.gsd}`].map(
          (label) => (
            <span
              key={label}
              className="rounded px-2 py-1 text-[8px] text-white/75 backdrop-blur"
              style={{ fontFamily: T.mono, background: "rgba(0,0,0,0.55)" }}
            >
              {label}
            </span>
          ),
        )}
      </div>
      <div
        className="absolute right-3 top-3 rounded px-2 py-1 text-[8px] text-white/60"
        style={{ fontFamily: T.mono, background: "rgba(0,0,0,0.45)" }}
      >
        {canRenderImage ? "IMAGE PREVIEW" : "PREVIEW"}
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <aside className="flex min-h-[640px] flex-col items-center justify-center gap-4 bg-white p-10 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border"
        style={{ background: T.paper, borderColor: T.border }}
      >
        <ImageIcon className="h-6 w-6" style={{ color: T.muted }} />
      </div>
      <div>
        <div
          className="mb-1.5 text-lg"
          style={{ fontFamily: T.serif, color: T.ink }}
        >
          Select a file
        </div>
        <div className="text-sm leading-relaxed" style={{ color: T.muted }}>
          Choose a file from the queue
          <br />
          to view details and upload for inference.
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-2.5 text-[9px] uppercase tracking-[1.5px]"
      style={{ fontFamily: T.mono, color: T.muted }}
    >
      {children}
    </div>
  );
}
