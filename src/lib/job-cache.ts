import type { QueryClient } from "@tanstack/react-query";
import type { Job } from "./jobs";
import { queryKeys } from "./query-keys";

// Shared across observers so terminal refetches cannot trigger an invalidation loop.
const observedTerminals = new WeakMap<QueryClient, Set<string>>();

export function invalidateTerminalJobQueries(client: QueryClient, scope: string, job: Job) {
  if (!["completed", "failed", "cancelled"].includes(job.status)) return;
  const observed = observedTerminals.get(client) ?? new Set<string>();
  const observation = JSON.stringify([scope, job.id, job.status]);
  if (observed.has(observation)) return;
  observed.add(observation);
  observedTerminals.set(client, observed);

  const keys = [
    queryKeys.jobs.detail(scope, job.id),
    queryKeys.jobs.result(scope, job.id),
    queryKeys.jobs.project(scope, job.projectId),
    queryKeys.dashboard.summary(scope),
    queryKeys.uploads.project(scope, job.projectId),
  ];
  keys.forEach((queryKey) => {
    void client.invalidateQueries({ queryKey, exact: true });
  });
}
