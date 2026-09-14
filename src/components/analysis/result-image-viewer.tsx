"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";

export type ResultImageView = { id: string; label: string; url?: string | null };

export function selectResultImage(views: ResultImageView[], preferred: string, failed: ReadonlySet<string>) {
  const usable = views.filter((view) => view.url && !failed.has(view.url));
  return usable.find((view) => view.id === preferred)
    ?? usable.find((view) => view.id === "overlay")
    ?? usable[0];
}

export function ResultImageViewer({ views, previewError }: { views: ResultImageView[]; previewError: boolean }) {
  const [preferred, setPreferred] = useState("overlay");
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const available = views.filter((view) => Boolean(view.url));
  const selected = selectResultImage(views, preferred, failed);
  const failedViews = available.filter((view) => failed.has(view.url as string));

  function choose(view: ResultImageView) {
    setPreferred(view.id);
    setFailed((current) => {
      const next = new Set(current);
      next.delete(view.url as string);
      return next;
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Analysis image view">
        {available.map((view) => (
          <button key={view.id} type="button" aria-pressed={selected?.id === view.id}
            onClick={() => choose(view)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${selected?.id === view.id
              ? "bg-brand-primary text-white" : "bg-surface-overlay text-text-secondary"}`}>
            {view.label}
          </button>
        ))}
      </div>
      {failedViews.length > 0 && (
        <p role="status" className="mb-3 text-sm text-text-secondary">
          {failedViews.map((view) => view.label).join(", ")} could not load.
          {selected ? ` Showing ${selected.label}.` : " The image previews are unavailable."}
          {" Select a view to retry. The analysis data remains available below."}
        </p>
      )}
      {selected?.url ? (
        <ArtifactImage key={selected.url} url={selected.url}
          label={selected.id === "overlay" ? "Classified Overlay" : selected.label}
          onError={() => setFailed((current) => new Set(current).add(selected.url as string))} />
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg bg-surface-overlay text-text-secondary">
          <ImageOff className="h-8 w-8" />
          <p className="mt-2 text-sm">
            {available.length ? "No image preview could be loaded."
              : previewError ? "Original preview unavailable." : "No image artifact was returned."}
          </p>
        </div>
      )}
    </>
  );
}

function ArtifactImage({ url, label, onError }: { url: string; label: string; onError: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A cached image may finish before hydration attaches its load handler.
    if (!imageRef.current?.complete) return;
    if (imageRef.current.naturalWidth > 0) setLoaded(true);
    else onError();
  }, [onError]);
  return (
    <figure aria-label={label}>
      <figcaption className="mb-2 text-sm font-medium text-text-primary">{label}</figcaption>
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-black" aria-busy={!loaded}>
        {!loaded && (
          <div role="status" className="absolute inset-0 flex items-center justify-center gap-3 text-sm text-white">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Loading {label.toLowerCase()}…
          </div>
        )}
        <img ref={imageRef} src={url} alt={`${label} analysis view`} decoding="async"
          onLoad={() => setLoaded(true)} onError={onError}
          className={`h-auto max-h-[70vh] w-full object-contain ${loaded ? "opacity-100" : "opacity-0"}`} />
      </div>
    </figure>
  );
}
