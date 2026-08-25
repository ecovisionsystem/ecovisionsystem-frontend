import { AlertCircle, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { normalizeAnalysisStatus } from "@/lib/analysis";
import { cn } from "@/lib/utils";

const statusContent = {
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
    detail: "EcoVision could not complete this analysis.",
    icon: AlertCircle,
    className: "border-error/25 bg-error-bg text-error",
  },
  cancelled: {
    label: "Cancelled",
    detail: "This analysis was cancelled.",
    icon: XCircle,
    className: "border-border bg-surface-overlay text-text-secondary",
  },
} as const;

export function AnalysisStatus({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
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
        {!compact && <p className="text-xs opacity-80">{content.detail}</p>}
      </div>
    </div>
  );
}
