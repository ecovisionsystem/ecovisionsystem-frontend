"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { AppShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useParams } from "next/navigation";
import { Download, ChevronDown } from "lucide-react";
import type { VegetationClass } from "@/types";

export default function ResultsPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const handleSignOut = () => {
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Results" breadcrumbs={[{ label: "Results" }]} />
        <div className="p-6 space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  const vegClasses: Array<{
    name: VegetationClass;
    label: string;
    percentage: number;
  }> = [
    { name: "spartina", label: "Spartina maritima", percentage: 62 },
    { name: "puccinellia", label: "Puccinellia maritima", percentage: 28 },
    { name: "other_veg", label: "Other vegetation", percentage: 10 },
  ];

  return (
    <AppShell user={user} onSignOut={handleSignOut}>
      <PageHeader
        title="Inference Results"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Results" },
        ]}
        action={
          <div className="relative">
            <Button
              onClick={() => setIsExportOpen(!isExportOpen)}
              icon={Download}
              variant="primary"
            >
              Export
              <ChevronDown className="h-4 w-4" />
            </Button>
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-10">
                <button className="block w-full text-left px-4 py-2 hover:bg-surface-overlay text-sm">
                  Segmentation GeoTIFF
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-surface-overlay text-sm">
                  Confidence Map GeoTIFF
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-surface-overlay text-sm">
                  Dominance Statistics
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-surface-overlay text-sm">
                  Full Report (PDF)
                </button>
              </div>
            )}
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Map Panel */}
          <Card padding="lg">
            <div className="bg-surface-overlay rounded-lg h-96 flex items-center justify-center mb-4">
              <p className="text-text-muted">Map viewer placeholder</p>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-primary">Layers</p>
              {vegClasses.map((veg) => (
                <label
                  key={veg.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `var(--color-${veg.name === "other_veg" ? "other-veg" : veg.name})`,
                    }}
                  />
                  <span className="text-text-primary">{veg.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Stats Panel */}
          <div className="space-y-4">
            {/* Dominance Stats */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Dominance Stats
              </h3>
              <div className="space-y-3">
                {vegClasses.map((veg) => (
                  <div key={veg.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">
                        {veg.label}
                      </span>
                      <span className="text-xs font-mono text-text-primary">
                        {veg.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-overlay rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${veg.percentage}%`,
                          backgroundColor: `var(--color-${veg.name === "other_veg" ? "other-veg" : veg.name})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Image Metadata */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Image Metadata
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">File</dt>
                  <dd className="font-mono text-text-primary">
                    foryd_may25.tif
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Size</dt>
                  <dd className="font-mono text-text-primary">2.3 GB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">GSD</dt>
                  <dd className="font-mono text-text-primary">0.03 m/px</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">CRS</dt>
                  <dd className="font-mono text-text-primary">EPSG:4326</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Tiles</dt>
                  <dd className="font-mono text-text-primary">1,024</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
