"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import type { UploadQueueFile } from "./upload-types";
import { uploadTheme as T } from "./upload-utils";

export type EnsureUploadPreview = (
  file: UploadQueueFile,
  force?: boolean,
) => Promise<void>;

interface UploadImageProps {
  file: UploadQueueFile;
  onPreviewNeeded?: EnsureUploadPreview;
  className?: string;
  eager?: boolean;
}

type PreviewState = "idle" | "loading" | "ready" | "error";

export function UploadImage({
  file,
  onPreviewNeeded,
  className = "h-full w-full object-cover",
  eager = false,
}: UploadImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(eager);
  const [renderedUrl, setRenderedUrl] = useState<string>();
  const [state, setState] = useState<PreviewState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isTiff = isTiffUpload(file);

  useEffect(() => {
    if (eager) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!isVisible) return;

    const controller = new AbortController();
    let generatedUrl: string | undefined;

    const load = async () => {
      setErrorMessage("");

      if (!file.previewUrl && !file.file) {
        if (file.status === "uploaded" && onPreviewNeeded) {
          setState("loading");
          await onPreviewNeeded(file);
          return;
        }
        setState("idle");
        return;
      }

      if (!isTiff) {
        setRenderedUrl(file.previewUrl);
        setState(file.previewUrl ? "loading" : "idle");
        return;
      }

      setState("loading");
      generatedUrl = await renderTiffPreview(
        file.file,
        file.previewUrl,
        controller.signal,
      );
      if (controller.signal.aborted) {
        URL.revokeObjectURL(generatedUrl);
        return;
      }
      setRenderedUrl(generatedUrl);
      setState("ready");
    };

    void load().catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setRenderedUrl(undefined);
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Preview unavailable.",
      );
    });

    return () => {
      controller.abort();
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [
    attempt,
    file.file,
    file.previewUrl,
    file.status,
    isTiff,
    isVisible,
    onPreviewNeeded,
  ]);

  const retry = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setState("loading");
    setErrorMessage("");
    if (file.uploadId && onPreviewNeeded) {
      try {
        await onPreviewNeeded(file, true);
      } catch (error) {
        setState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Preview unavailable.",
        );
        return;
      }
    }
    setAttempt((current) => current + 1);
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {renderedUrl && (
        <img
          src={renderedUrl}
          alt={file.name}
          className={className}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => {
            setRenderedUrl(undefined);
            setState("error");
            setErrorMessage("The uploaded image preview could not be loaded.");
          }}
        />
      )}

      {(state === "idle" || state === "loading") && !renderedUrl && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px]"
            style={{
              fontFamily: T.mono,
              color: T.inkSoft,
              background: "rgba(255,255,255,0.82)",
            }}
          >
            {state === "loading" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading image
              </>
            ) : (
              "Preview loads when visible"
            )}
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/45 px-4 text-center">
          <AlertCircle className="h-4 w-4 text-white/80" />
          <span className="line-clamp-2 text-[9px] text-white/80">
            {errorMessage || "Preview unavailable."}
          </span>
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-medium text-black"
          >
            <RefreshCcw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

function isTiffUpload(file: UploadQueueFile) {
  const contentType = file.contentType.toLowerCase();
  const filename = file.name.toLowerCase();
  return (
    contentType === "image/tiff" ||
    contentType === "image/geotiff" ||
    filename.endsWith(".tif") ||
    filename.endsWith(".tiff")
  );
}

async function renderTiffPreview(
  file: File | undefined,
  previewUrl: string | undefined,
  signal: AbortSignal,
) {
  const { fromBlob, fromUrl } = await import("geotiff");
  const tiff = file
    ? await fromBlob(file, signal)
    : previewUrl
      ? await fromUrl(previewUrl, {}, signal)
      : undefined;
  if (!tiff) throw new Error("No TIFF source is available.");

  const image = await tiff.getImage();
  const sourceWidth = image.getWidth();
  const sourceHeight = image.getHeight();
  if (!sourceWidth || !sourceHeight) {
    throw new Error("The TIFF has invalid image dimensions.");
  }

  const scale = Math.min(1, 1024 / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const raster = await image.readRGB({
    width,
    height,
    resampleMethod: "bilinear",
    signal,
  });
  if (signal.aborted) throw new DOMException("Preview aborted", "AbortError");

  const rgb = raster as Uint8Array;
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let source = 0, target = 0; target < rgba.length; source += 3, target += 4) {
    rgba[target] = rgb[source] ?? 0;
    rgba[target + 1] = rgb[source + 1] ?? 0;
    rgba[target + 2] = rgb[source + 2] ?? 0;
    rgba[target + 3] = 255;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas preview is unavailable.");
  context.putImageData(new ImageData(rgba, width, height), 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) =>
        value
          ? resolve(value)
          : reject(new Error("Unable to encode the TIFF preview.")),
      "image/jpeg",
      0.86,
    );
  });
  if (signal.aborted) throw new DOMException("Preview aborted", "AbortError");
  return URL.createObjectURL(blob);
}
