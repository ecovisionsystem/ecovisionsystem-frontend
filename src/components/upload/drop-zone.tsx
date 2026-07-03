"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadTheme as T } from "./upload-utils";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
}

export function DropZone({ onFiles }: DropZoneProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        x: 8 + (index % 6) * 17 + (Math.floor(index / 6) % 2) * 8,
        y: 20 + Math.floor(index / 6) * 28,
        r: 1.2 + (index % 3) * 0.5,
        o: 0.15 + (index % 4) * 0.08,
      })),
    [],
  );

  const prevent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      prevent(event);
      setDrag(false);
      const files = Array.from(event.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles],
  );

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) onFiles(files);
    event.target.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        prevent(event);
        setDrag(true);
      }}
      onDragLeave={(event) => {
        prevent(event);
        setDrag(false);
      }}
      onDragOver={prevent}
      onDrop={handleDrop}
      className="relative flex min-h-[320px] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed transition-all"
      style={{
        borderColor: drag ? T.leaf : T.border,
        background: drag ? "rgba(61,122,18,0.04)" : T.cream,
        boxShadow: drag ? "0 0 0 4px rgba(61,122,18,0.08)" : "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".tif,.tiff,.png,.jpg,.jpeg,.geotiff"
        onChange={handleInput}
        hidden
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {dots.map((dot, index) => (
          <circle
            key={index}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r={dot.r}
            fill={drag ? T.lime : T.ink}
            opacity={drag ? dot.o * 2.5 : dot.o}
          />
        ))}
      </svg>

      <div
        className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-full border"
        style={{
          borderColor: drag ? T.lime : T.border,
          animation: drag ? "uploadSpinRing 4s linear infinite" : "none",
        }}
      >
        <div
          className="absolute -inset-3 rounded-full border border-dashed"
          style={{
            borderColor: drag ? "rgba(108,192,42,0.4)" : "rgba(0,0,0,0.08)",
          }}
        />
        <UploadCloud
          className="h-9 w-9"
          style={{ color: drag ? T.leaf : T.muted }}
        />
      </div>

      <div className="relative text-center">
        <div
          className="mb-2 text-[22px]"
          style={{
            fontFamily: T.sans,
            color: drag ? T.moss : T.ink,
            letterSpacing: "-0.5px",
          }}
        >
          {drag ? "Release to upload" : "Drop imagery here"}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {["Presigned S3 Upload", "GSD Detection"].map((label) => (
            <span
              key={label}
              className="rounded-full border px-3 py-1 text-[9px]"
              style={{
                fontFamily: T.mono,
                color: T.leaf,
                background: "rgba(43,77,14,0.06)",
                borderColor: "rgba(43,77,14,0.12)",
                letterSpacing: "0.3px",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="pointer-events-none mt-6 rounded-full border  px-6 py-2 text-sm font-semibold shadow-sm"
        style={{ color: T.moss, borderColor: "rgba(43,77,14,0.22)" }}
      >
        Browse files
      </button>
    </div>
  );
}
