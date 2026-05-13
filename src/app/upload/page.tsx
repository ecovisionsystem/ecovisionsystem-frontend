"use client";

import React, { useState, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { AppShell, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Upload, FileQuestion } from "lucide-react";

export default function UploadPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSignOut = () => {
    router.push("/auth/login");
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ["image/tiff", "image/jpeg"];
    if (!validTypes.some((type) => file.type === type)) {
      alert("Please upload a GeoTIFF or JPEG file");
      return;
    }

    // Validate file size (10GB max)
    const maxSize = 10 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 10 GB");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Upload file
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadProgress(100);

      // Redirect to dashboard after successful upload
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <AppShell user={user} onSignOut={handleSignOut}>
        <PageHeader title="Upload" breadcrumbs={[{ label: "Upload" }]} />
        <div className="p-6">
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

      <div className="p-6 max-w-2xl mx-auto">
        {!selectedFile ? (
          <Card
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-brand-primary bg-brand-muted"
                : "border-border"
            }`}
          >
            <Upload className="h-16 w-16 mx-auto mb-4 text-brand-primary opacity-75" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Drag & drop your drone imagery here
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              or click to browse
            </p>
            <p className="text-xs text-text-muted mb-4">
              GeoTIFF (.tif, .tiff) or JPEG · Maximum file size: 10 GB
            </p>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".tif,.tiff,.jpg,.jpeg"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </Card>
        ) : (
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <FileQuestion className="h-5 w-5 text-brand-primary flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {(selectedFile.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
              >
                Change
              </Button>
            </div>

            {isUploading && (
              <>
                <div className="w-full bg-surface-overlay rounded-full h-2 overflow-hidden mb-4">
                  <div
                    className="bg-brand-accent h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  {Math.round(uploadProgress)}% uploaded
                </p>
              </>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                loading={isUploading}
                disabled={uploadProgress > 0}
                className="flex-1"
              >
                Upload
              </Button>
              <Button
                variant="secondary"
                disabled={isUploading}
                onClick={() => {
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
