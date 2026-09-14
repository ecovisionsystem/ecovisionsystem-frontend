import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { analysisSubmissionError, createAnalysisSubmissionGuard } from "./analysis-submission";
import { FileDetail } from "./file-detail";
import type { UploadQueueFile } from "./upload-types";

const state = vi.hoisted(() => ({ job: {} as { data?: { status: string }; error?: Error } }));
vi.mock("@/hooks/useAnalysisQueries", () => ({ useJob: () => state.job }));
vi.stubGlobal("React", React);
afterAll(() => { vi.unstubAllGlobals(); });
beforeEach(() => { state.job = {}; });
const file: UploadQueueFile = {
  id: "example", clientUploadId: "example", uploadId: "upload", name: "example.png", size: 100,
  contentType: "image/png", gsd: "-", crs: "-", bands: "RGB", dims: "-",
  lat: "-", lng: "-", status: "uploaded", progress: 100, metadata: {}, canResume: false,
};

describe("analysis submission", () => {
  it.each(["selected", "registering", "pending", "ready", "uploading", "paused", "failed", "cancelled"] as const)("rejects %s even with an upload ID and 100 percent transport progress", (status) => {
    expect(createAnalysisSubmissionGuard().claim({ ...file, status })).toBe(false);
  });
  it("requires an upload ID and no existing job", () => {
    const guard = createAnalysisSubmissionGuard();
    expect(guard.claim({ ...file, uploadId: undefined })).toBe(false);
    expect(guard.claim({ ...file, jobId: "existing" })).toBe(false);
  });
  it("blocks synchronous duplicate clicks and stale clicks after acceptance", () => {
    const guard = createAnalysisSubmissionGuard();
    expect(guard.claim(file)).toBe(true);
    expect(guard.claim(file)).toBe(false);
    expect(guard.claim({ ...file, uploadId: "other" })).toBe(false);
    guard.finish("upload", true);
    expect(guard.claim(file)).toBe(false);
    expect(guard.claim({ ...file, uploadId: "other" })).toBe(true);
  });
  it("allows retry after an unsuccessful submission", () => {
    const guard = createAnalysisSubmissionGuard();
    expect(guard.claim(file)).toBe(true);
    guard.finish("upload", false);
    expect(guard.claim(file)).toBe(true);
  });
  it.each([400, 404, 405, 409, 500, 503])("keeps infrastructure details out of status %s errors", (status) => {
    expect(analysisSubmissionError(new ApiError(status, "private model / SQS / AWS details"))).not.toMatch(/private|model|SQS|AWS/);
  });
  it("offers Run Analysis only after upload completion and disables Starting", () => {
    const render = (item: UploadQueueFile, submitting = false) => renderToStaticMarkup(
      <FileDetail file={item} onRunAnalysis={() => {}} analysisSubmitting={submitting} />,
    );
    expect(render(file)).toMatch(/<button[^>]*aria-busy="false"[^>]*>Run Analysis<\/button>/);
    expect(render(file, true)).toMatch(/<button[^>]*disabled=""[^>]*aria-busy="true"/);
    expect(render(file, true)).toContain("Starting…");
    expect(render({ ...file, status: "uploading" })).not.toContain("Run Analysis");
  });
  it.each([["pending", "Queued"], ["queued", "Queued"], ["inferencing", "Processing"], ["completed", "Completed"], ["failed", "Failed"], ["cancelled", "Cancelled"]])("uses accepted backend state %s on the disabled button", (status, label) => {
    state.job = { data: { status } };
    const html = renderToStaticMarkup(<FileDetail file={{ ...file, jobId: "existing" }} />);
    expect(html).toMatch(new RegExp(`<button[^>]*disabled=""[^>]*>${label}</button>`));
    expect(html).toContain("View analysis");
  });
  it("does not label an unavailable accepted job as Queued", () => {
    state.job = { data: { status: "queued" }, error: new Error("private") };
    const html = renderToStaticMarkup(<FileDetail file={{ ...file, jobId: "existing" }} />);
    expect(html).not.toContain("Queued");
    expect(html).not.toContain("private");
    expect(html).toContain("Status unavailable");
  });
});
