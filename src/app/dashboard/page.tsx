"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import { getDashboardSummary, type DashboardSummary } from "@/lib/jobs";

export default function DashboardPage() {
  const { user, apiToken, isLoading, requireAuth, signOut } = useAuth();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [error, setError] = React.useState("");
  requireAuth();
  React.useEffect(() => { if (!isLoading && user) getDashboardSummary(apiToken).then(setSummary).catch((e) => setError(e instanceof Error ? e.message : "Unable to load dashboard.")); }, [apiToken, isLoading, user]);
  if (isLoading || (!summary && !error)) return <AppShell user={user} onSignOut={signOut}><PageHeader title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]} /><div className="p-6 space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-64 w-full" /></div></AppShell>;
  if (!user) return null;
  return <AppShell user={user} onSignOut={signOut}>
    <PageHeader title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]} action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New Project</Button>} />
    <div className="p-6 space-y-6">
      {error ? <Card className="text-error">{error}</Card> : <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[["Active Jobs", summary!.counts.active], ["Failed Jobs", summary!.counts.failed], ["Completed Jobs", summary!.counts.completed]].map(([label, value]) => <Card key={String(label)} padding="lg" className="text-center"><p className="text-3xl font-bold text-brand-primary">{value}</p><p className="text-sm text-text-secondary mt-2">{label}</p></Card>)}</div>
        <Card><h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>{summary!.recentJobs.length ? <div className="space-y-2">{summary!.recentJobs.map((job) => <Link key={job.id} href={`/results/${job.id}`} className="flex justify-between border-b py-3"><span>{job.inferenceType}</span><span>{job.status}</span></Link>)}</div> : <p className="text-sm text-text-secondary">No inference jobs yet.</p>}</Card>
      </>}
    </div><ProjectCreateModal open={modalOpen} onOpenChange={setModalOpen} />
  </AppShell>;
}
