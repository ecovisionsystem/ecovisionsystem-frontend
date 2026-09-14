import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import { invalidateTerminalJobQueries } from "./job-cache";
import { analysisPollInterval } from "./analysis";
import type { Job } from "./jobs";
import { queryKeys } from "./query-keys";

const job = { id: "job", projectId: "project", status: "queued" } as Job;
const keys = [
  queryKeys.jobs.detail("user", job.id),
  queryKeys.jobs.result("user", job.id),
  queryKeys.jobs.project("user", job.projectId),
  queryKeys.dashboard.summary("user"),
  queryKeys.uploads.project("user", job.projectId),
];

it.each(["completed", "failed", "cancelled"] as const)("invalidates all five queries once for %s without touching other projects or users", (status) => {
  const client = new QueryClient();
  const unrelated = [queryKeys.jobs.detail("other-user", job.id), queryKeys.uploads.project("user", "other-project")];
  [...keys, ...unrelated].forEach((key) => client.setQueryData(key, {}));
  const invalidate = vi.spyOn(client, "invalidateQueries");
  invalidateTerminalJobQueries(client, "user", { ...job, status });
  keys.forEach((key) => expect(client.getQueryState(key)?.isInvalidated).toBe(true));
  unrelated.forEach((key) => expect(client.getQueryState(key)?.isInvalidated).toBe(false));
  expect(invalidate).toHaveBeenCalledTimes(5);
  invalidateTerminalJobQueries(client, "user", { ...job, status });
  expect(invalidate).toHaveBeenCalledTimes(5);
  expect(analysisPollInterval(status)).toBe(false);
  client.clear();
});

it.each(["pending", "queued", "preprocessing", "inferencing", "postprocessing"] as const)("polls %s every four seconds without terminal invalidation", (status) => {
  const client = new QueryClient();
  const invalidate = vi.spyOn(client, "invalidateQueries");
  invalidateTerminalJobQueries(client, "user", { ...job, status });
  expect(invalidate).not.toHaveBeenCalled();
  expect(analysisPollInterval(status)).toBe(4000);
  client.clear();
});

it("refreshes mounted job data once at termination without a refetch loop", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
  const terminal = { ...job, status: "failed" } as Job;
  client.setQueryData(keys[0], terminal);
  const fetchJob = vi.fn(async () => terminal);
  const observer = new QueryObserver(client, { queryKey: keys[0], queryFn: fetchJob });
  const unsubscribe = observer.subscribe((result) => {
    if (result.data) invalidateTerminalJobQueries(client, "user", result.data);
  });
  invalidateTerminalJobQueries(client, "user", terminal);
  await vi.waitFor(() => expect(observer.getCurrentResult().fetchStatus).toBe("idle"));
  expect(fetchJob).toHaveBeenCalledOnce();
  expect(analysisPollInterval(observer.getCurrentResult().data?.status)).toBe(false);
  unsubscribe();
  client.clear();
});
