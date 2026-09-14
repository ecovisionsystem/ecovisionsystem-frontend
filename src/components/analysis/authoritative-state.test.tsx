import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import Hero from "@/components/shared/landingpage/Hero";
import LandingComparisonV2Sections from "@/components/shared/landingpage/comparison-v2/LandingComparisonV2Sections";
import { AnalysisStatus } from "./analysis-status";
import { FileCard } from "@/components/upload/file-card";
import type { UploadQueueFile } from "@/components/upload/upload-types";

// Next supplies the JSX runtime; Vitest's existing configuration uses classic JSX.
vi.stubGlobal("React", React);
afterAll(() => { vi.unstubAllGlobals(); });

describe("authoritative UI states", () => {
  it("keeps the hero preview shell without invented results or stages", () => {
    const html = renderToStaticMarkup(<Hero />);
    expect(html).toContain("ANALYSIS PREVIEW");
    expect(html).toContain("No confidence data available.");
    expect(html).toContain("No analysis selected.");
    expect(html).not.toMatch(/Encoding tiles|Segmenting…|Classifying blobs|Scoring dominance|tile_0024|zone_A|Species Confidence.*96\.0%/);
  });

  it("keeps alternate preview navigation without simulated inference", () => {
    const html = renderToStaticMarkup(<LandingComparisonV2Sections />);
    expect(html).toContain('href="/dashboard/projects"');
    expect(html).toContain("No segmentation result selected.");
    expect(html).not.toMatch(/Run Inference|Running\.\.\.|96\.2%|99\.0%|MODEL CONFIDENCE - PIXEL GRID/);
  });

  it("renders queued and unknown statuses without claiming processing or failure", () => {
    const queued = renderToStaticMarkup(<AnalysisStatus status="queued" />);
    expect(queued).toContain("Queued");
    expect(queued).not.toMatch(/Processing|%/);
    const unknown = renderToStaticMarkup(<AnalysisStatus status="new-status" />);
    expect(unknown).toContain("Status unavailable");
    expect(unknown).not.toContain("Failed");
  });

  it("retains measured upload progress and does not invent registration progress", () => {
    const file: UploadQueueFile = {
      id: "example", clientUploadId: "example", name: "example.png", size: 100,
      contentType: "image/png", gsd: "-", crs: "-", bands: "RGB", dims: "-",
      lat: "-", lng: "-", status: "registering", progress: 0,
      metadata: {}, canResume: false,
    };
    const render = (item: UploadQueueFile) => renderToStaticMarkup(
      <FileCard file={item} active={false} onClick={() => {}} onRemove={() => {}} />,
    );
    expect(render(file)).toContain("width:0%");
    expect(render(file)).not.toContain("width:8%");
    expect(render({ ...file, status: "uploading", progress: 42 })).toContain("42%");
  });
});


describe.each([false, true])("AnalysisStatus compact=%s", (compact) => {
  it.each([
    ["pending", "Queued"],
    ["queued", "Queued"],
    ["preprocessing", "Processing"],
    ["inferencing", "Processing"],
    ["postprocessing", "Processing"],
    ["completed", "Completed"],
    ["failed", "Failed"],
    ["cancelled", "Cancelled"],
  ])("renders backend %s as %s", (status, label) => {
    const html = renderToStaticMarkup(<AnalysisStatus status={status} compact={compact} />);
    expect(html).toContain(`>${label}</p>`);
    expect(html).toContain('role="status"');
    expect(html.includes("animate-spin")).toBe(label === "Processing");
    expect(html).not.toContain("%");
  });
});
