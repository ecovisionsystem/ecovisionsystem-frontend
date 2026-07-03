"use client";

import React from "react";
import { uploadTheme as T } from "./upload-utils";
import type { UploadQueueFile } from "./upload-types";

interface StatusBarProps {
  files: UploadQueueFile[];
}

export function StatusBar({ files }: StatusBarProps) {
  const active = files.filter(
    (file) => file.status === "registering" || file.status === "uploading",
  );

  if (!active.length) return null;

  const averageProgress =
    active.reduce((total, file) => total + file.progress, 0) / active.length;

  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-5 z-20 flex justify-center">
      <div
        className="flex w-full max-w-xl items-center gap-4 rounded-xl px-5 py-3 text-xs shadow-2xl"
        style={{ background: T.ink }}
      >
        <div className="h-2 w-2 rounded-full" style={{ background: T.lime, animation: "uploadPulse 1.5s infinite" }} />
        <span className="min-w-0 flex-1 truncate text-white/70">
          {active.length === 1
            ? `${active[0].status === "registering" ? "Registering" : "Uploading"} ${active[0].name.slice(0, 32)}...`
            : `${active.length} active uploads`}
        </span>
        <div className="h-0.5 w-32 rounded bg-white/10">
          <div
            className="h-full rounded transition-[width]"
            style={{
              width: `${averageProgress}%`,
              background: `linear-gradient(90deg,${T.leaf},${T.lime})`,
            }}
          />
        </div>
        <span className="text-[10px]" style={{ fontFamily: T.mono, color: T.lime }}>
          {averageProgress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
