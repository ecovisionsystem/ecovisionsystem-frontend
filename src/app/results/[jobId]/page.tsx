"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInferenceResult, type InferenceResult } from "@/lib/jobs";

export default function ResultsPage() {
  const { user, apiToken, isLoading, requireAuth, signOut } = useAuth();
  const jobId = useParams().jobId as string;
  const [result, setResult] = React.useState<InferenceResult | null>(null);
  const [error, setError] = React.useState("");
  requireAuth();
  React.useEffect(() => { if (!isLoading && user && jobId) getInferenceResult(jobId, apiToken).then(setResult).catch((e) => setError(e instanceof Error ? e.message : "Unable to load result.")); }, [apiToken, isLoading, jobId, user]);
  if (isLoading || (!result && !error)) return <AppShell user={user} onSignOut={signOut}><PageHeader title="Results" breadcrumbs={[{ label: "Results" }]} /><div className="p-6"><Skeleton className="h-96 w-full" /></div></AppShell>;
  if (!user) return null;
  return <AppShell user={user} onSignOut={signOut}><PageHeader title="Inference Results" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Results" }]} />
    <div className="p-6 space-y-6">{error ? <Card className="text-error">{error}</Card> : <>
      <Card padding="lg"><h2 className="font-semibold mb-4">Output artefacts</h2><div className="flex flex-wrap gap-3">{Object.entries(result!.artifacts).filter(([, url]) => Boolean(url)).map(([name, url]) => <a key={name} href={url!} target="_blank" rel="noreferrer" className="text-brand-primary underline">{name.replace(/Url$/, "")}</a>)}</div></Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card padding="lg"><h2 className="font-semibold mb-4">Dominance statistics</h2>{result!.dominanceStats.length ? result!.dominanceStats.map((stat) => <div key={stat.vegetationClass} className="mb-4"><div className="flex justify-between text-sm"><span>{stat.vegetationClass}</span><span>{(stat.mean * 100).toFixed(1)}%</span></div><div className="h-2 bg-surface-overlay rounded"><div className="h-2 bg-brand-primary rounded" style={{ width: `${Math.min(100, stat.mean * 100)}%` }} /></div></div>) : <p className="text-sm text-text-secondary">No dominance statistics were produced.</p>}</Card>
      <Card padding="lg"><h2 className="font-semibold mb-4">Inference metrics</h2><dl className="space-y-2">{Object.entries(result!.metrics).map(([key, value]) => <div key={key} className="flex justify-between"><dt>{key}</dt><dd>{value == null ? "-" : Number(value).toFixed(4)}</dd></div>)}</dl><p className="mt-4 text-sm">Model {result!.modelVersion}</p><p className="text-sm text-text-secondary">Processed {new Date(result!.processedAt).toLocaleString()}</p></Card></div>
    </>}</div></AppShell>;
}
