import { AlertCircle, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { normalizeAnalysisStatus, shortJobReference, type AnalysisJobStatus } from "@/lib/analysis";
import { cn } from "@/lib/utils";

const statusContent = {
  unknown: {
    label: "Status unavailable",
    detail: "The analysis status could not be determined.",
    icon: AlertCircle,
    className: "border-border bg-surface-overlay text-text-secondary",
  },
  queued: {
    label: "Queued",
    detail: "Analysis is waiting to start.",
    icon: Clock3,
    className: "border-warning/25 bg-warning-bg text-warning",
  },
  processing: {
    label: "Processing",
    detail: "EcoVision is analysing this image.",
    icon: Loader2,
    className: "border-info/25 bg-info-bg text-info",
  },
  completed: {
    label: "Completed",
    detail: "Analysis complete.",
    icon: CheckCircle2,
    className: "border-success/25 bg-success-bg text-success",
  },
  failed: {
    label: "Failed",
    detail: "Analysis could not be completed.",
    icon: AlertCircle,
    className: "border-error/25 bg-error-bg text-error",
  },
  cancelled: {
    label: "Cancelled",
    detail: "This analysis was cancelled.",
    icon: XCircle,
    className: "border-border bg-surface-overlay text-text-secondary",
  },
} as const satisfies Record<AnalysisJobStatus, {
  label: string;
  detail: string;
  icon: typeof AlertCircle;
  className: string;
}>;

export function analysisStatusLabel(status: string): string {
  return statusContent[normalizeAnalysisStatus(status)].label;
}

export function AnalysisStatus({
  status,
  compact = false,
  jobId,
}: {
  status: string;
  compact?: boolean;
  jobId?: string;
}) {
  const normalized = normalizeAnalysisStatus(status);
  const content = statusContent[normalized];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2",
        content.className,
      )}
      role="status"
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          normalized === "processing" && "animate-spin",
        )}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{content.label}</p>
        {(!compact || normalized === "failed") && <p className="text-xs opacity-80">{content.detail}</p>}
        {normalized === "failed" && jobId && (
          <p className="text-xs opacity-80">Reference: {shortJobReference(jobId)}</p>
        )}
      </div>
    </div>
  );
}
