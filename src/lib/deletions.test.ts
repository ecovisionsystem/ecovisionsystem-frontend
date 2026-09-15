import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteData, deletionPath, deletionCopy } from "./deletions";

vi.mock("./api-config", () => ({ getApiBaseUrl: () => "https://api.example.test" }));
afterEach(() => vi.unstubAllGlobals());
describe("permanent deletion contract", () => {
  it("keeps project purge separate from the existing archive endpoint", () => {
    expect(deletionPath("project", "project/one")).toBe("/projects/project%2Fone/data");
    expect(deletionPath("upload", "image")).toBe("/uploads/image");
    expect(deletionPath("job", "analysis")).toBe("/jobs/analysis");
  });
  it("explains exactly what each cascade removes", () => {
    expect(deletionCopy.project.impact).toContain("uploaded images");
    expect(deletionCopy.upload.impact).toContain("its analysis");
    expect(deletionCopy.job.impact).toContain("original uploaded image is kept");
  });
  it("sends an authenticated DELETE and waits for backend acceptance", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "receipt", status: "accepted" }), { status: 202 }));
    vi.stubGlobal("fetch", fetch);
    expect(await deleteData("job", "analysis", "synthetic-token")).toEqual({ id: "receipt", status: "accepted" });
    expect(fetch.mock.calls[0][1].method).toBe("DELETE");
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer synthetic-token");
  });
  it("does not report deletion when the backend rejects it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })));
    await expect(deleteData("project", "project", "synthetic-token")).rejects.toThrow();
  });
});
