"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminStats, type AdminStats } from "@/lib/jobs";

export default function AdminPage() {
  const { user, apiToken, isLoading, requireAuth, signOut } = useAuth();
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [error, setError] = React.useState("");
  requireAuth();
  React.useEffect(() => { if (!isLoading && user?.role === "admin") getAdminStats(apiToken).then(setStats).catch((e) => setError(e instanceof Error ? e.message : "Unable to load admin data.")); }, [apiToken, isLoading, user]);
  if (isLoading) return <AppShell user={user} onSignOut={signOut}><PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} /><div className="p-6"><Skeleton className="h-64 w-full" /></div></AppShell>;
  if (!user) return null;
  if (user.role !== "admin") return <AppShell user={user} onSignOut={signOut}><PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} /><div className="p-6"><Card>Access restricted.</Card></div></AppShell>;
  return <AppShell user={user} onSignOut={signOut}><PageHeader title="Admin" breadcrumbs={[{ label: "Admin" }]} /><div className="p-6 space-y-6">{error ? <Card className="text-error">{error}</Card> : stats ? <><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[["Users", stats.users], ["Projects", stats.projects], ["Uploads", stats.uploads]].map(([label, value]) => <Card key={String(label)} padding="lg"><p className="text-sm text-text-secondary">{label}</p><p className="text-2xl font-bold">{value}</p></Card>)}</div><Card padding="lg"><h2 className="font-semibold mb-3">Jobs by status</h2>{Object.keys(stats.jobsByStatus).length ? Object.entries(stats.jobsByStatus).map(([status, count]) => <div key={status} className="flex justify-between py-2 border-b"><span>{status}</span><span>{count}</span></div>) : <p className="text-sm text-text-secondary">No jobs yet.</p>}</Card></> : <Skeleton className="h-64 w-full" />}</div></AppShell>;
}
