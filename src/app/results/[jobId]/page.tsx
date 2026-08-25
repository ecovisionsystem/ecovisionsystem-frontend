"use client";

import React from "react";
import { Download, ImageOff } from "lucide-react";
import { useParams } from "next/navigation";
import { AnalysisStatus } from "@/components/analysis/analysis-status";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import {
  useJob,
  useJobResult,
  useUploadPreview,
} from "@/hooks/useAnalysisQueries";
import {
  dominantSpecies,
  normalizeAnalysisStatus,
  shortJobReference,
} from "@/lib/analysis";
import { ApiError } from "@/lib/api-client";

type ImageView = "original" | "overlay" | "segmentation";

export default function ResultsPage() {
  const { user, isLoading, signOut } = useAuth();
  const jobId = useParams().jobId as string;
  const jobQuery = useJob(jobId);
  const jobState = jobQuery.data
    ? normalizeAnalysisStatus(jobQuery.data.status)
    : undefined;
  const resultQuery = useJobResult(jobId, jobState === "completed");
  const previewQuery = useUploadPreview(jobQuery.data?.uploadId);
  const [view, setView] = React.useState<ImageView>("original");

  useRequireAuth();

  React.useEffect(() => {
    if (resultQuery.data?.artifacts.overlayImageUrl) setView("overlay");
  }, [resultQuery.data?.artifacts.overlayImageUrl]);

  if (isLoading || jobQuery.isLoading) {
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Analysis Result" breadcrumbs={[{ label: "Results" }]} />
        <div className="space-y-4 p-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  if (jobQuery.error || !jobQuery.data) {
    const unavailable =
      jobQuery.error instanceof ApiError &&
      (jobQuery.error.status === 404 || jobQuery.error.status === 405);
    return (
      <AppShell user={user} onSignOut={signOut}>
        <PageHeader title="Analysis Result" breadcrumbs={[{ label: "Results" }]} />
        <div className="p-6">
          <Card className="border-error/20 bg-error-bg text-error">
            {unavailable
              ? "Analysis service is not yet available."
              : "This analysis could not be loaded."}
          </Card>
        </div>
      </AppShell>
    );
  }

  const job = jobQuery.data;
  const reference = shortJobReference(job.id);

  return (
    <AppShell user={user} onSignOut={signOut}>
      <PageHeader
        title="Analysis Result"
        description={reference}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/dashboard/projects" },
          {
            label: "Project",
            href: `/dashboard/projects/${job.projectId}`,
          },
          { label: "Analysis Result" },
        ]}
      />
      <div className="space-y-6 p-6">
        {jobState !== "completed" ? (
          <JobState job={job} />
        ) : resultQuery.isLoading ? (
          <Card>
            <AnalysisStatus status={job.status} />
            <p className="mt-4 text-sm text-text-secondary">
              Loading the persisted analysis result…
            </p>
          </Card>
        ) : resultQuery.error || !resultQuery.data ? (
          <Card className="border-warning/25 bg-warning-bg">
            <h2 className="font-semibold text-text-primary">
              Result is not available yet
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              The job completed, but its persisted result could not be loaded.
              Refresh after the result service is available.
            </p>
          </Card>
        ) : (
          <CompletedResult
            result={resultQuery.data}
            originalUrl={previewQuery.data?.previewUrl}
            previewError={Boolean(previewQuery.error)}
            view={view}
            onViewChange={setView}
            reference={reference}
          />
        )}
      </div>
    </AppShell>
  );
}

function JobState({ job }: { job: NonNullable<ReturnType<typeof useJob>["data"]> }) {
  const state = normalizeAnalysisStatus(job.status);
  return (
    <Card padding="lg" className="max-w-3xl">
      <AnalysisStatus status={job.status} />
      {(state === "failed" || state === "cancelled") && (
        <div className="mt-5">
          <p className="text-sm text-text-secondary">
            Reference: {shortJobReference(job.id)}
          </p>
          {state === "failed" && job.errorMessage && (
            <p className="mt-2 text-sm text-error">
              EcoVision could not complete this analysis.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function CompletedResult({
  result,
  originalUrl,
  previewError,
  view,
  onViewChange,
  reference,
}: {
  result: NonNullable<ReturnType<typeof useJobResult>["data"]>;
  originalUrl?: string;
  previewError: boolean;
  view: ImageView;
  onViewChange: (view: ImageView) => void;
  reference: string;
}) {
  const views: Array<{ id: ImageView; label: string; url?: string | null }> = [
    { id: "original", label: "Original", url: originalUrl },
    { id: "overlay", label: "Overlay", url: result.artifacts.overlayImageUrl },
    {
      id: "segmentation",
      label: "Segmentation",
      url: result.artifacts.segmentationMaskUrl,
    },
  ];
  const availableViews = views.filter((item) => Boolean(item.url));
  const selected = availableViews.find((item) => item.id === view) ?? availableViews[0];
  const dominant = dominantSpecies(result.dominanceStats);
  const downloads = [
    ["Download Overlay", result.artifacts.overlayImageUrl],
    ["Download Mask", result.artifacts.segmentationMaskUrl],
    ["Download Dominance JSON", result.artifacts.dominanceJsonUrl],
    ["Download GeoTIFF", result.artifacts.geotiffUrl],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <>
      <Card padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
              Dominant species
            </p>
            {dominant ? (
              <>
                <h2 className="mt-2 text-2xl font-semibold italic text-text-primary">
                  {formatVegetationClass(dominant.vegetationClass)}
                </h2>
                <p className="mt-1 text-3xl font-bold text-brand-primary">
                  {formatPercent(dominant.mean)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-text-secondary">
                No dominance data was returned.
              </p>
            )}
          </div>
          <div className="text-right text-sm text-text-secondary">
            <p>Legacy Pixel-Based Dominance</p>
            <p className="mt-1">Model {result.modelVersion}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]">
        <Card padding="sm">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Analysis image view">
            {availableViews.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected?.id === item.id}
                onClick={() => onViewChange(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  selected?.id === item.id
                    ? "bg-brand-primary text-white"
                    : "bg-surface-overlay text-text-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {selected?.url ? (
            <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-black">
              <img
                src={selected.url}
                alt={`${selected.label} analysis view`}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg bg-surface-overlay text-text-secondary">
              <ImageOff className="h-8 w-8" />
              <p className="mt-2 text-sm">
                {previewError ? "Original preview unavailable." : "No image artifact was returned."}
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-text-primary">Species dominance</h3>
            {result.dominanceStats.length ? (
              <div className="mt-4 space-y-4">
                {result.dominanceStats.map((stat) => (
                  <div key={stat.vegetationClass}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{formatVegetationClass(stat.vegetationClass)}</span>
                      <span>{formatPercent(stat.mean)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded bg-surface-overlay">
                      <div
                        className="h-full rounded bg-brand-primary"
                        style={{ width: `${Math.min(100, Math.max(0, stat.mean * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-secondary">
                No species dominance data was returned.
              </p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-text-primary">Analysis information</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <InfoRow label="Model" value={result.modelVersion} />
              <InfoRow label="Analysis" value="Legacy Pixel-Based Dominance" />
              <InfoRow label="Processed" value={new Date(result.processedAt).toLocaleString()} />
              <InfoRow label="Reference" value={reference} />
            </dl>
          </Card>

          {downloads.length > 0 && (
            <Card>
              <h3 className="font-semibold text-text-primary">Downloads</h3>
              <div className="mt-4 space-y-2">
                {downloads.map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-brand-primary hover:bg-surface-overlay"
                  >
                    <Download className="h-4 w-4" /> {label}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="text-right text-text-primary">{value}</dd>
    </div>
  );
}

function formatVegetationClass(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPercent(value: number) {
  return `${(Math.max(0, value) * 100).toFixed(1)}%`;
}
