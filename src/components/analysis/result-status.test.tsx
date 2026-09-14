import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import ResultsPage from "@/app/results/[jobId]/page";

const queries = vi.hoisted(() => ({ job: vi.fn(), result: vi.fn(), project: vi.fn(), upload: vi.fn() }));
vi.mock("next/navigation", () => ({ useParams: () => ({ jobId: "example-job" }) }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "example-user" }, isLoading: false, signOut: vi.fn() }),
  useRequireAuth: vi.fn(),
}));
vi.mock("@/hooks/useAnalysisQueries", () => ({
  useJob: queries.job,
  useProject: queries.project,
  useUpload: queries.upload,
  useJobResult: queries.result,
  useUploadPreview: () => ({ data: undefined }),
}));
vi.mock("@/components/layout", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => children,
  PageHeader: () => null,
}));
vi.stubGlobal("React", React);
afterAll(() => { vi.unstubAllGlobals(); });

beforeEach(() => {
  vi.clearAllMocks();
  queries.project.mockReturnValue({ data: { name: "Saltmarsh survey" } });
  queries.upload.mockReturnValue({ data: { filename: "survey-image.tif" } });
  queries.job.mockReturnValue({ data: { id: "example-job", projectId: "example-project", status: "completed" } });
});

describe("result page uses backend job state", () => {
  it.each([
    { isLoading: true },
    { error: new Error("Result unavailable") },
    { data: {
      artifacts: { overlayImageUrl: null, segmentationMaskUrl: null, dominanceJsonUrl: null, geotiffUrl: null },
      speciesDetected: [], dominanceStats: [], modelVersion: "example-model", processedAt: "2026-01-01T00:00:00Z",
    } },
  ])("keeps Completed visible independently of result availability (%j)", (result) => {
    queries.result.mockReturnValue(result);
    const html = renderToStaticMarkup(<ResultsPage />);
    expect(html.match(/>Completed<\/p>/g)).toHaveLength(1);
    expect(queries.result).toHaveBeenCalledWith("example-job", true);
  });

  it("does not infer completion from a cached result while the backend reports queued", () => {
    queries.job.mockReturnValue({ data: { id: "example-job", status: "queued" } });
    queries.result.mockReturnValue({ data: { modelVersion: "cached-model", artifacts: { overlayImageUrl: null } } });
    const html = renderToStaticMarkup(<ResultsPage />);
    expect(html).toContain(">Queued</p>");
    expect(html).not.toContain("Completed");
    expect(html).not.toContain("cached-model");
    expect(queries.result).toHaveBeenCalledWith("example-job", false);
  });
});


it.each(["preprocessing", "inferencing", "postprocessing"])("shows honest processing details for %s", (status) => {
  queries.job.mockReturnValue({ data: { id: "example-job", projectId: "example-project", uploadId: "example-upload", status, progressPercent: 65 } });
  queries.result.mockReturnValue({});
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).toContain("EcoVision is analysing your imagery");
  expect(html).toContain("Saltmarsh survey");
  expect(html).toContain("survey-image.tif");
  expect(html).toContain("Job reference");
  expect(html).toContain("JOB-AMPLEJOB");
  expect(html).toContain("Current state");
  expect(html).toContain(">Processing</p>");
  expect(html).toContain("You can leave this page. Analysis will continue.");
  expect(html).not.toContain("65%");
  expect(queries.project).toHaveBeenCalledWith("example-project");
  expect(queries.upload).toHaveBeenCalledWith("example-upload");
});

it.each(["failed", "cancelled"])("does not promise continuing analysis for %s", (status) => {
  queries.job.mockReturnValue({ data: { id: "example-job", status } });
  queries.result.mockReturnValue({});
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).not.toContain("Analysis will continue");
  expect(html).not.toContain("EcoVision is analysing");
});

it("shows unavailable metadata honestly without hiding the processing state", () => {
  queries.job.mockReturnValue({ data: { id: "example-job", status: "inferencing" } });
  queries.result.mockReturnValue({});
  queries.project.mockReturnValue({ error: new Error("private") });
  queries.upload.mockReturnValue({ error: new Error("private") });
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).toContain("Project unavailable");
  expect(html).toContain("Filename unavailable");
  expect(html).toContain(">Processing</p>");
  expect(html).not.toContain("private");
});


it("reproduces persisted result values after a fresh page render using backend dominance means", () => {
  const persisted = {
    speciesDetected: ["persisted_species"],
    artifacts: { overlayImageUrl: "https://example.test/overlay.png" },
    dominanceStats: [{ vegetationClass: "different_class", mean: 0.873 }],
    modelVersion: "persisted-version", processedAt: "2026-01-01T00:00:00Z",
  };
  queries.result.mockReturnValue({ data: persisted });
  const first = renderToStaticMarkup(<ResultsPage />);
  queries.result.mockReturnValue({ data: JSON.parse(JSON.stringify(persisted)) });
  const refreshed = renderToStaticMarkup(<ResultsPage />);
  expect(refreshed).toBe(first);
  expect(first).toContain("Different class");
  expect(first).not.toContain("Persisted species");
  expect(first).toContain("87.3%");
  expect(first).toContain("https://example.test/overlay.png");
  expect(first).toContain("2026-01-01 00:00:00 UTC");
  expect(first).toContain("Dominant Species");
  expect(first).not.toContain("Legacy Pixel-Based Dominance");
});


it("selects the greatest persisted mean and renders only returned dominance classes", () => {
  queries.result.mockReturnValue({ data: {
    speciesDetected: ["not_in_dominance"], artifacts: {}, modelVersion: "example", processedAt: "2026-01-01T00:00:00Z",
    dominanceStats: [
      { vegetationClass: "puccinellia_maritima", mean: 0.286 },
      { vegetationClass: "SPARTINA_MARITIMA", mean: 0.614 },
    ],
  } });
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).toMatch(/<h2[^>]*>Spartina maritima<\/h2>/);
  expect(html).toContain("Puccinellia maritima");
  expect(html).not.toContain("Not in dominance");
  expect(html).not.toContain("Background");
  expect(html).toContain("61.4%");
  expect(html).toContain("28.6%");
  expect(html).toContain("width:61.4%");
  expect(html).not.toContain("Spartina Maritima");
});

it("does not use detected species to invent missing dominance", () => {
  queries.result.mockReturnValue({ data: {
    speciesDetected: ["Spartina maritima"], artifacts: {}, modelVersion: "example", processedAt: "2026-01-01T00:00:00Z",
    dominanceStats: [],
  } });
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).toContain("No valid dominance data was returned.");
  expect(html).not.toContain("Spartina maritima");
  expect(html).not.toContain("100.0%");
});


it.each(["500", "ClientError", "SQLAlchemy", "S3", "SQS", "ECS"])("keeps %s diagnostics out of the failed analysis page", (diagnostic) => {
  queries.job.mockReturnValue({ data: { id: "example-job", status: "failed", errorMessage: diagnostic, errorCode: diagnostic } });
  queries.result.mockReturnValue({});
  const html = renderToStaticMarkup(<ResultsPage />);
  expect(html).toContain("Analysis could not be completed.");
  expect(html).toContain("Reference: JOB-AMPLEJOB");
  expect(html).not.toContain(diagnostic);
  expect(html).not.toMatch(/Retry|retry/);
  expect(queries.result).toHaveBeenCalledWith("example-job", false);
});
