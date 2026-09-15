"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { deleteData, deletionCapabilities, deletionCopy, type DeletionKind } from "@/lib/deletions";

type DeleteProps = {
  kind: DeletionKind; resourceId: string; name: string; onDeleted?: () => void | Promise<void>;
};

export function DeleteDataButton(props: DeleteProps) {
  const { apiToken, user } = useAuth();
  if (!apiToken || !user) return null;
  return <EnabledDeleteDataButton {...props} apiToken={apiToken} scope={user.id} />;
}

function EnabledDeleteDataButton({ kind, resourceId, name, onDeleted, apiToken, scope }: DeleteProps & { apiToken: string; scope: string }) {
  const client = useQueryClient();
  const capability = useQuery({ queryKey: ["deletion-capabilities", scope],
    queryFn: () => deletionCapabilities(apiToken), enabled: Boolean(apiToken), retry: false, staleTime: 60_000 });
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const copy = deletionCopy[kind];
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);

  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    if (confirmation !== "DELETE" || submitting.current || !capability.data?.enabled) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      await deleteData(kind, resourceId, apiToken);
      // Stop old reads before discarding cached data; deletion is confirmed by the API.
      const predicate = (query: { queryKey: readonly unknown[] }) =>
        query.queryKey[1] === scope && ["projects", "uploads", "jobs", "dashboard", "admin"].includes(String(query.queryKey[0]));
      await client.cancelQueries({ predicate });
      setOpen(false);
      await onDeleted?.();
      await client.resetQueries({ predicate });
    } catch {
      setError("Deletion could not be confirmed. Please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  if (!capability.data?.enabled) return null;
  return <>
    <Button type="button" variant="secondary" onClick={() => { setConfirmation(""); setError(""); setOpen(true); }}
      className="text-red-700 border-red-200" aria-label={`${copy.label}: ${name}`}>
      <Trash2 className="h-4 w-4" aria-hidden="true" /> {copy.label}
    </Button>
    <dialog ref={dialog} aria-labelledby={titleId}
      onCancel={(event) => { if (pending) event.preventDefault(); else setOpen(false); }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl bg-white p-6 text-text-primary shadow-xl backdrop:bg-black/40">
      <form onSubmit={confirm} className="space-y-4">
        <h2 id={titleId} className="text-xl font-semibold">{copy.label}?</h2>
        <p className="break-words font-medium">{name}</p>
        <p className="text-sm">{copy.impact}</p>
        <p className="text-sm text-text-secondary">This cannot be undone. File cleanup continues in the background. Work already running may take time to stop; its results will not reappear.</p>
        <label className="block text-sm">Type DELETE to confirm
          <input autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)}
            disabled={pending} className="mt-2 block w-full rounded-lg border border-border p-2" autoFocus />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" disabled={pending} onClick={() => setOpen(false)}>Keep {kind === "upload" ? "image" : kind === "job" ? "analysis" : "project"}</Button>
          <Button type="submit" variant="destructive" disabled={pending || confirmation !== "DELETE"}>
            {pending ? "Deleting…" : copy.label}
          </Button>
        </div>
      </form>
    </dialog>
  </>;
}
