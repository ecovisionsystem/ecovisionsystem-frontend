'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface text-text-primary px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary mb-4">
              EcoVision 2.0
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              Scientific UAV vegetation intelligence for ecologists and researchers.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary">
              Work with high-resolution drone imagery, interpret segmentation results, and export clean data for GIS analysis. Designed for academic workflows, not consumer distraction.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/login">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/upload">
                <Button variant="secondary" size="lg">Upload imagery</Button>
              </Link>
            </div>
          </div>

          <Card className="border-border bg-surface-raised p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Why EcoVision?</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Build confidence with precise classification metrics, transparent upload feedback, and export-ready scientific outputs.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm text-text-secondary">• Results built for GIS workflows</p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm text-text-secondary">• Upload progress with speed and ETA</p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm text-text-secondary">• Class colours consistent across map & charts</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary">Clarity over decoration</h3>
            <p className="mt-3 text-sm text-text-secondary">
              Every interface element earns its place. The segmentation viewer remains the result, not the distraction.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary">Data density with calm</h3>
            <p className="mt-3 text-sm text-text-secondary">
              Precise metrics, confidence intervals, and metadata are surfaced without overwhelming the researcher.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary">Role-aware access</h3>
            <p className="mt-3 text-sm text-text-secondary">
              User views are filtered by role, so researchers and admins only see the data they can act on.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
