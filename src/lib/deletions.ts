import { apiRequest } from "./api-client";

export type DeletionKind = "project" | "upload" | "job";
export const deletionCopy: Record<DeletionKind, { label: string; impact: string }> = {
  project: { label: "Delete project", impact: "Permanently removes this project, its uploaded images, queued analyses, results and generated images." },
  upload: { label: "Delete image", impact: "Permanently removes this uploaded image and its analysis, including queued work, results and generated images." },
  job: { label: "Delete analysis", impact: "Permanently removes this analysis and its results and generated images. The original uploaded image is kept." },
};

export function deletionPath(kind: DeletionKind, id: string) {
  const encoded = encodeURIComponent(id);
  return kind === "project" ? `/projects/${encoded}/data` : `/${kind === "upload" ? "uploads" : "jobs"}/${encoded}`;
}

export function deleteData(kind: DeletionKind, id: string, token?: string) {
  return apiRequest<{ id: string; status: "accepted" }>(deletionPath(kind, id), token, { method: "DELETE" });
}

export function deletionCapabilities(token?: string) {
  return apiRequest<{ enabled: boolean }>("/deletions/capabilities", token);
}
