"use client";

import React, { useState } from "react";
import { FileImage, X } from "lucide-react";
import { formatBytes, statusMeta, uploadTheme as T } from "./upload-utils";
import type { UploadQueueFile } from "./upload-types";

interface FileCardProps {
  file: UploadQueueFile;
  active: boolean;
  onClick: () => void;
  onRemove: (id: string) => void;
}

export function FileCard({ file, active, onClick, onRemove }: FileCardProps) {
  const [hovered, setHovered] = useState(false);
  const status = statusMeta[file.status];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full rounded-[14px] p-4 text-left transition-all"
      style={{
        background: active ? "#fff" : hovered ? "rgba(255,255,255,0.6)" : "transparent",
        border: `1px solid ${active ? "rgba(0,0,0,0.09)" : "transparent"}`,
        boxShadow: active ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div className="mb-3 flex items-start gap-3">
        <FileTypeIcon type={file.bands} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold" style={{ color: T.ink }}>
            {file.name}
          </div>
          <div className="mt-1 text-[9px]" style={{ fontFamily: T.mono, color: T.muted }}>
            {formatBytes(file.size)} - {file.dims}
          </div>
        </div>
        {hovered && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(file.id);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.08)", color: T.muted }}
            aria-label={`Remove ${file.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {(file.status === "registering" ||
        file.status === "uploading" ||
        file.status === "paused") && (
        <div className="mb-2 h-0.5 overflow-hidden rounded bg-black/10">
          <div
            className="h-full rounded transition-[width]"
            style={{
              width: file.status === "registering" ? "8%" : `${file.progress}%`,
              background:
                file.status === "registering"
                  ? `linear-gradient(90deg,${T.amber},#F8C66A)`
                  : file.status === "uploading"
                  ? `linear-gradient(90deg,${T.blue},#7AD4E8)`
                  : `linear-gradient(90deg,${T.leaf},${T.lime})`,
              animation:
                file.status === "paused"
                  ? "none"
                  : "uploadShimmer 1.5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wide"
          style={{ fontFamily: T.mono, color: status.color, background: status.bg }}
        >
          {status.label}
          {file.status === "uploading" || file.status === "paused"
            ? ` ${file.progress.toFixed(0)}%`
            : ""}
        </span>
        <span className="text-[9px]" style={{ fontFamily: T.mono, color: T.muted }}>
          GSD {file.gsd}
        </span>
      </div>
    </div>
  );
}

export function FileTypeIcon({ type }: { type?: string }) {
  const color = type?.includes("MS") ? T.blue : T.leaf;

  return (
    <div
      className="flex h-10 w-9 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border"
      style={{ background: `${color}14`, borderColor: `${color}28` }}
    >
      <FileImage className="h-4 w-4" style={{ color }} />
      <span className="text-[6px] tracking-wide" style={{ fontFamily: T.mono, color }}>
        {type || "RGB"}
      </span>
    </div>
  );
}
