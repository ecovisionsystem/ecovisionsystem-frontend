import { describe, expect, it } from "vitest";
import {
  ACTIVE_JOB_POLL_INTERVAL_MS,
  analysisPollInterval,
  dominantSpecies,
  formatDominancePercent,
  groupAnalysisStatusCounts,
  isAnalysisJobApiStatus,
  normalizeAnalysisStatus,
  shortJobReference,
} from "./analysis";

describe("analysis status contract", () => {
  it.each([
    ["pending", "queued"],
    ["queued", "queued"],
    ["preprocessing", "processing"],
    ["inferencing", "processing"],
    ["postprocessing", "processing"],
    ["completed", "completed"],
    ["failed", "failed"],
    ["cancelled", "cancelled"],
  ])("normalizes %s to %s", (raw, expected) => {
    expect(isAnalysisJobApiStatus(raw)).toBe(true);
    expect(normalizeAnalysisStatus(raw)).toBe(expected);
  });

  it("fails closed for an unknown backend status", () => {
    expect(isAnalysisJobApiStatus("mystery")).toBe(false);
    expect(normalizeAnalysisStatus("mystery")).toBe("unknown");
  });

  it("polls only active states every four seconds", () => {
    expect(analysisPollInterval("pending")).toBe(ACTIVE_JOB_POLL_INTERVAL_MS);
    expect(analysisPollInterval("inferencing")).toBe(ACTIVE_JOB_POLL_INTERVAL_MS);
    expect(analysisPollInterval("completed")).toBe(false);
    expect(analysisPollInterval("failed")).toBe(false);
    expect(analysisPollInterval("cancelled")).toBe(false);
    expect(analysisPollInterval()).toBe(false);
  });
});

describe("authoritative result presentation", () => {
  it("selects the greatest persisted dominance mean", () => {
    expect(
      dominantSpecies([
        { vegetationClass: "spartina", mean: 0.614 },
        { vegetationClass: "puccinellia", mean: 0.286 },
        { vegetationClass: "background", mean: 0.1 },
      ]),
    ).toEqual({ vegetationClass: "spartina", mean: 0.614 });
  });

  it("does not invent a species when dominance data is absent", () => {
    expect(dominantSpecies([])).toBeNull();
  });

  it("creates a short opaque job reference", () => {
    expect(shortJobReference("12345678-1234-1234-1234-abcdef123456")).toBe(
      "JOB-EF123456",
    );
  });
});


describe("missing and invalid dominance measurements", () => {
  it.each([NaN, Infinity, -0.1, 1.1])("does not invent a percentage for %s", (mean) => {
    expect(formatDominancePercent(mean)).toBe("Unavailable");
    expect(dominantSpecies([{ vegetationClass: "example", mean }])).toBeNull();
  });
  it("preserves valid zero and measured percentages", () => {
    expect(formatDominancePercent(0)).toBe("0.0%");
    expect(formatDominancePercent(0.614)).toBe("61.4%");
    expect(formatDominancePercent(1)).toBe("100.0%");
  });
});


it("groups backend counts under the shared labels without losing jobs", () => {
  const groups = groupAnalysisStatusCounts({
    pending: 2, queued: 3, preprocessing: 1, inferencing: 4, postprocessing: 2,
    completed: 8, failed: 1, cancelled: 2, unrecognized: 1,
  });
  expect(groups.map(({ status, count }) => [normalizeAnalysisStatus(status), count])).toEqual([
    ["queued", 5], ["processing", 7], ["completed", 8], ["failed", 1], ["cancelled", 2], ["unknown", 1],
  ]);
});
