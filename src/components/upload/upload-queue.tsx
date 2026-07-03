"use client";

import React from "react";
import { Plus } from "lucide-react";
import { statusMeta, uploadTheme as T } from "./upload-utils";
import { FileCard } from "./file-card";
import type { UploadQueueFile } from "./upload-types";

interface UploadQueueProps {
  files: UploadQueueFile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onFiles: (files: File[]) => void;
}

export function UploadQueue({
  files,
  selectedId,
  onSelect,
  onRemove,
  onFiles,
}: UploadQueueProps) {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length) onFiles(selectedFiles);
    event.target.value = "";
  };

  return (
    <aside
      className="flex h-100 flex-col overflow-hidden rounded-2xl  "
      style={{ background: T.paper }}
    >
      <div className="shrink-0  px-5 pb-3 pt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[14px] font-bold" style={{ color: T.ink }}>
            Upload Queue
          </span>
          <span
            className="text-[10px]"
            style={{ fontFamily: T.mono, color: T.muted }}
          >
            {files.length} files
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(statusMeta).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: value.color }}
              />
              <span
                className="text-[8px] tracking-wide"
                style={{ fontFamily: T.mono, color: T.muted }}
              >
                {value.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {files.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 opacity-60">
            <div
              className="h-8 w-8 rounded-lg border"
              style={{ borderColor: T.muted }}
            />
            <span className="text-xs" style={{ color: T.muted }}>
              No files yet
            </span>
          </div>
        ) : (
          files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              active={selectedId === file.id}
              onClick={() => onSelect(file.id)}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      <div className="shrink-0 border-t p-3" style={{ borderColor: T.border }}>
        <label
          className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5"
          style={{ color: T.moss, borderColor: "rgba(43,77,14,0.25)" }}
        >
          <input
            type="file"
            multiple
            accept=".tif,.tiff,.png,.jpg,.jpeg"
            onChange={handleInput}
            hidden
          />
          <Plus className="h-4 w-4" />
          Add more files
        </label>
      </div>
    </aside>
  );
}
