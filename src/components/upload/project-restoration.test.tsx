import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { afterAll, expect, it, vi } from "vitest";
import { useJob, useProjectUploads } from "@/hooks/useAnalysisQueries";
import { mergeProjectUploads } from "./upload-dashboard";
import type { ProjectUpload } from "./upload-types";

const capture = vi.hoisted(() => ({ options: {} as any }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ apiToken: "synthetic", user: { id: "test-user" } }) }));
vi.mock("@tanstack/react-query", async (original) => ({
  ...await original<typeof import("@tanstack/react-query")>(),
  useQuery: (options: unknown) => { capture.options = options; return {}; },
  useQueryClient: () => ({}),
}));
vi.stubGlobal("React", React);
afterAll(() => { vi.unstubAllGlobals(); });
const upload: ProjectUpload = {
  id: "upload", projectId: "project", filename: "survey.png", status: "uploaded",
  fileSize: 100, contentType: "image/png", createdAt: "2026-01-01T00:00:00Z",
  completedAt: "2026-01-01T00:01:00Z", jobId: "backend-job", jobStatus: "inferencing",
};

it("restores the backend job with no browser state", () => {
  const restored = mergeProjectUploads([], [upload], "project");
  expect(restored).toHaveLength(1);
  expect(restored[0]).toMatchObject({ uploadId: "upload", jobId: "backend-job", status: "uploaded" });
});
it("replaces browser job identity with backend identity, including no job", () => {
  const files = mergeProjectUploads([], [upload], "project");
  files[0].jobId = "stale-browser-job";
  expect(mergeProjectUploads(files, [upload], "project")[0].jobId).toBe("backend-job");
  expect(mergeProjectUploads(files, [{ ...upload, jobId: null, jobStatus: null }], "project")[0].jobId).toBeUndefined();
});
it.each(["uploads", "job"])("refetches %s on immediate return despite a fresh global cache", async (kind) => {
  const useRead = kind === "uploads" ? useProjectUploads : useJob;
  function Read() {
    useRead(kind === "uploads" ? "project" : "backend-job");
    return null;
  }
  renderToStaticMarkup(<Read />);
  const options = capture.options;
  expect(options.refetchOnWindowFocus).toBe("always");
  expect(options.refetchOnReconnect).toBe("always");
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: false } } });
  client.setQueryData(options.queryKey, kind === "uploads" ? [] : { status: "queued" });
  const fresh = kind === "uploads" ? [upload] : { status: "completed" };
  const fetchBackend = vi.fn(async () => fresh);
  const observer = new QueryObserver(client, { ...options, queryFn: fetchBackend });
  const unsubscribe = observer.subscribe(() => {});
  await vi.waitFor(() => expect(observer.getCurrentResult().data).toEqual(fresh));
  expect(fetchBackend).toHaveBeenCalledOnce();
  unsubscribe();
  client.clear();
});
