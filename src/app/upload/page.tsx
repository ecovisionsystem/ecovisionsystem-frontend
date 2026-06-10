"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell, PageHeader } from "@/components/layout";
import { UploadDashboard } from "@/components/upload/upload-dashboard";

export default function UploadPage() {
  const { user, isLoading, requireAuth, signOut } = useAuth();

  requireAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Upload" breadcrumbs={[{ label: "Upload" }]} />
        <div className="p-6 h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user} onSignOut={handleSignOut}>
      <PageHeader
        title="Upload Drone Imagery"
        breadcrumbs={[{ label: "Upload" }]}
      />
      <UploadDashboard />
    </AppShell>
  );
}
