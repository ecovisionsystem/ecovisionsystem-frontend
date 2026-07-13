import type { UploadQueueFile, UploadStatus } from "./upload-types";

export const uploadTheme = { cream: "#F7F5F0", paper: "#F0EDE6", warm: "#E8E3D8", border: "rgba(0,0,0,0.07)", ink: "#16180F", inkSoft: "#3A3D2C", muted: "#8A8878", moss: "#2B4D0E", leaf: "#3D7A12", lime: "#6CC02A", dark: "#0E1409", blue: "#4AB8D4", amber: "#F5A623", red: "#E8523A", serif: "'Instrument Serif', Georgia, serif", sans: "'Geist', system-ui, sans-serif", mono: "'Geist Mono', 'Courier New', monospace" };

export const statusMeta: Record<UploadStatus, { label: string; color: string; bg: string }> = {
  selected: { label: "Selected", color: uploadTheme.muted, bg: "rgba(138,136,120,0.1)" },
  registering: { label: "Registering", color: uploadTheme.amber, bg: "rgba(245,166,35,0.1)" },
  pending: { label: "Pending", color: uploadTheme.amber, bg: "rgba(245,166,35,0.1)" },
  ready: { label: "Ready", color: uploadTheme.leaf, bg: "rgba(61,122,18,0.1)" },
  uploading: { label: "Uploading", color: uploadTheme.blue, bg: "rgba(74,184,212,0.1)" },
  paused: { label: "Paused", color: uploadTheme.amber, bg: "rgba(245,166,35,0.1)" },
  uploaded: { label: "Uploaded", color: uploadTheme.lime, bg: "rgba(108,192,42,0.1)" },
  failed: { label: "Failed", color: uploadTheme.red, bg: "rgba(232,82,58,0.1)" },
  cancelled: { label: "Cancelled", color: uploadTheme.red, bg: "rgba(232,82,58,0.1)" },
};

export const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1073741824 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1073741824).toFixed(2)} GB`;

export function filesToQueueItems(files: File[], projectId?: string): UploadQueueFile[] {
  return files.map((file) => ({ id: crypto.randomUUID(), clientUploadId: crypto.randomUUID(), projectId, file, name: file.name, size: file.size, contentType: file.type || "application/octet-stream", gsd: "-", crs: "Detecting...", bands: file.name.toLowerCase().includes("_ms") ? "MS-5" : "RGB", dims: "-", lat: "-", lng: "-", status: "selected", progress: 0, metadata: {}, canResume: false }));
}
