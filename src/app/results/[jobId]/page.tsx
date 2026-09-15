"use client";

import { DeleteDataButton } from "@/components/deletion/delete-data-button";

import React from "react";
import { Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ResultImageViewer } from "@/components/analysis/result-image-viewer";
import { AnalysisStatus } from "@/components/analysis/analysis-status";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import {
  useJob,
  useJobResult,
  useProject,
  useUpload,
  useUploadPreview,
} from "@/hooks/useAnalysisQueries";
import {
  formatDominancePercent,
  dominantSpecies,
  formatVegetationClass,
  isValidDominanceMean,
  normalizeAnalysisStatus,
  shortJobReference,
} from "@/lib/analysis";
import { ApiError } from "@/lib/api-client";

export default function ResultsPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const jobId = useParams().jobId as string;
  const jobQuery = useJob(jobId);
  const jobState = jobQuery.data
    ? normalizeAnalysisStatus(jobQuery.data.status)
    : undefined;
  const resultQuery = useJobResult(jobId, jobState === "completed");
  const previewQuery = useUploadPreview(jobQuery.data?.uploadId);

  useRequireAuth();

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
        action={<DeleteDataButton kind="job" resourceId={job.id} name={reference} onDeleted={() => router.replace(`/dashboard/projects/${job.projectId}`)} />}
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
            <AnalysisStatus jobId={job.id} status={job.status} />
            <p className="mt-4 text-sm text-text-secondary">
              Loading the persisted analysis result…
            </p>
          </Card>
        ) : resultQuery.error || !resultQuery.data ? (
          <Card className="border-warning/25 bg-warning-bg">
            <AnalysisStatus jobId={job.id} status={job.status} />
            <h2 className="mt-4 font-semibold text-text-primary">
              Result is not available yet
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              The job completed, but its persisted result could not be loaded.
              Refresh after the result service is available.
            </p>
          </Card>
        ) : (
          <CompletedResult
            status={job.status}
            result={resultQuery.data}
            originalUrl={previewQuery.data?.previewUrl}
            previewError={Boolean(previewQuery.error)}
            reference={reference}
          />
        )}
      </div>
    </AppShell>
  );
}

function JobState({ job }: { job: NonNullable<ReturnType<typeof useJob>["data"]> }) {
  const state = normalizeAnalysisStatus(job.status);
  const projectQuery = useProject(job.projectId);
  const uploadQuery = useUpload(job.uploadId);
  const active = state === "queued" || state === "processing";
  const projectName = projectQuery.error ? "Project unavailable"
    : projectQuery.data?.name ?? (projectQuery.isLoading ? "Loading project…" : "Project unavailable");
  const filename = uploadQuery.error ? "Filename unavailable"
    : uploadQuery.data?.filename ?? (uploadQuery.isLoading ? "Loading filename…" : "Filename unavailable");

  return (
    <Card padding="lg" className="max-w-3xl">
      {active && (
        <h2 className="mb-6 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
          {state === "processing"
            ? "EcoVision is analysing your imagery"
            : "Your analysis is queued"}
        </h2>
      )}
      <dl className="space-y-4 text-sm">
        <InfoRow label="Project" value={projectName} />
        <InfoRow label="Image filename" value={filename} />
        <InfoRow label="Job reference" value={shortJobReference(job.id)} />
        <div className="border-t border-border pt-4">
          <dt className="mb-2 text-text-secondary">Current state</dt>
          <dd><AnalysisStatus jobId={job.id} status={job.status} /></dd>
        </div>
      </dl>
      {active && (
        <p className="mt-6 rounded-lg bg-surface-overlay p-4 text-sm text-text-secondary">
          You can leave this page. Analysis will continue.
        </p>
      )}
    </Card>
  );
}

function CompletedResult({
  status,
  result,
  originalUrl,
  previewError,
  reference,
}: {
  status: string;
  result: NonNullable<ReturnType<typeof useJobResult>["data"]>;
  originalUrl?: string;
  previewError: boolean;
  reference: string;
}) {
  const views = [
    { id: "original", label: "Original", url: originalUrl },
    { id: "overlay", label: "Overlay", url: result.artifacts.overlayImageUrl },
    {
      id: "segmentation",
      label: "Segmentation",
      url: result.artifacts.segmentationMaskUrl,
    },
  ];
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
              Dominant Species
            </p>
            {dominant ? (
              <>
                <h2 className="mt-2 text-2xl font-semibold italic text-text-primary">
                  {formatVegetationClass(dominant.vegetationClass)}
                </h2>
                <p className="mt-1 text-3xl font-bold text-brand-primary">
                  {formatDominancePercent(dominant.mean)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-text-secondary">
                No valid dominance data was returned.
              </p>
            )}
          </div>
          <div className="space-y-2 text-right text-sm text-text-secondary">
            <AnalysisStatus status={status} compact />
            <p className="mt-1">Model {result.modelVersion}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]">
        <Card padding="sm">
          <ResultImageViewer key={reference} views={views} previewError={previewError} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-text-primary">Species dominance</h3>
            {result.dominanceStats.length ? (
              <div className="mt-4 space-y-4">
                {result.dominanceStats.map((stat) => (
                  <div key={stat.vegetationClass}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="italic">{formatVegetationClass(stat.vegetationClass)}</span>
                      <span>{formatDominancePercent(stat.mean)}</span>
                    </div>
                    {isValidDominanceMean(stat.mean) && (
                      <div className="mt-1 h-2 overflow-hidden rounded bg-surface-overlay">
                        <div
                          className="h-full rounded bg-brand-primary"
                          style={{ width: `${stat.mean * 100}%` }}
                        />
                      </div>
                    )}
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
              <InfoRow label="Processed" value={new Date(result.processedAt).toISOString().replace("T", " ").replace(".000Z", " UTC")} />
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
      <dd className="min-w-0 break-words text-right text-text-primary">{value}</dd>
    </div>
  );
}
