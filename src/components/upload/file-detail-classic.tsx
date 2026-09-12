"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { FileTypeIcon } from "./file-card";
import { formatBytes, statusMeta, uploadTheme as T } from "./upload-utils";
import type { UploadQueueFile, UploadTab } from "./upload-types";

/**
 * Preserved version of the original right-sidebar visual shell.
 *
 * It is intentionally not mounted in the demo workflow. The old simulated
 * inference and fabricated result content are not part of this component;
 * future work can supply truthful tab content through `children`.
 */
export interface ClassicFileDetailProps {
  file?: UploadQueueFile;
  activeTab: UploadTab;
  onTabChange: (tab: UploadTab) => void;
  children?: React.ReactNode;
}

const classicTabs: Array<{ id: UploadTab; label: string }> = [
  { id: "meta", label: "Metadata" },
  { id: "analysis", label: "Analysis" },
  { id: "results", label: "Results" },
];

export function ClassicFileDetail({
  file,
  activeTab,
  onTabChange,
  children,
}: ClassicFileDetailProps) {
  if (!file) return <ClassicEmptyDetail />;

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

        <div
          className="flex border-b"
          role="tablist"
          style={{ borderColor: T.border }}
        >
          {classicTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
              className="-mb-px border-b-2 px-4 py-2 text-[13px] transition-colors"
              style={{
                color: activeTab === item.id ? T.ink : T.muted,
                borderColor: activeTab === item.id ? T.moss : "transparent",
                fontWeight: activeTab === item.id ? 600 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5">{children}</div>
    </aside>
  );
}

function ClassicEmptyDetail() {
  return (
    <aside className="flex min-h-[640px] flex-col items-center justify-center gap-4 rounded-2xl bg-white p-10 text-center">
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
          to view its details.
        </div>
      </div>
    </aside>
  );
}
