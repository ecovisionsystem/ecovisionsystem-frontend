import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "./api-client";
import { createJob } from "./jobs";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("job API", () => {
  it("submits only the upload id and fixed inference type", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "job-1",
          projectId: "project-1",
          uploadId: "upload-1",
          status: "pending",
          progressPercent: 0,
          inferenceType: "ecovision",
          modelVersion: null,
          errorCode: null,
          errorMessage: null,
          createdAt: "2026-08-25T00:00:00Z",
          queuedAt: null,
          startedAt: null,
          completedAt: null,
          updatedAt: "2026-08-25T00:00:00Z"
        }),
        { status: 202, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await createJob(
      { uploadId: "upload-1", inferenceType: "ecovision" },
      "token-value",
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    const body = JSON.parse(request.body);
    expect(url).toBe("https://api.example.test/api/v1/jobs");
    expect(request.method).toBe("POST");
    expect(body).toEqual({
      uploadId: "upload-1",
      inferenceType: "ecovision",
    });
    expect(body).not.toHaveProperty("projectId");
    expect(body).not.toHaveProperty("model");
  });

  it("preserves safe HTTP status and request reference", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            detail: "No active model version exists for this inference type",
            requestId: "request-safe-1",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    await expect(apiRequest("/jobs", "token")).rejects.toMatchObject({
      name: ApiError.name,
      status: 409,
      requestId: "request-safe-1",
    });
  });
});
