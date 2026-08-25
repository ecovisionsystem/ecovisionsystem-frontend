import { afterEach, describe, expect, it, vi } from "vitest";
import { createProject } from "./projects";
import { retryUpload } from "./uploads";
import { validateUploadFile } from "@/components/upload/upload-utils";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function response(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("truthful project and upload contracts", () => {
  it("creates an inference project with only supported optional fields", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
    const fetchMock = vi.fn().mockResolvedValue(
      response({ id: "project-1", name: "Survey", purpose: "inference" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await createProject(
      {
        name: "Survey",
        purpose: "inference",
        location: "Foryd Bay",
        description: "July survey",
      },
      "token",
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: "Survey",
      purpose: "inference",
      location: "Foryd Bay",
      description: "July survey",
    });
  });

  it("retries a registered upload through the backend retry endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        upload: { id: "upload-1" },
        uploadUrl: "https://uploads.example.test/signed",
        method: "PUT",
        expiresAt: "2026-08-25T01:00:00Z",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await retryUpload("upload-1", "token");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example.test/api/v1/uploads/upload-1/retry",
    );
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("rejects empty, oversized, and unsupported files before registration", () => {
    expect(validateUploadFile({ name: "empty.tif", size: 0 } as File)).toContain("empty");
    expect(
      validateUploadFile({ name: "huge.tif", size: 5_368_709_121 } as File),
    ).toContain("5 GB");
    expect(validateUploadFile({ name: "notes.txt", size: 10 } as File)).toContain("TIFF");
    expect(validateUploadFile({ name: "survey.tif", size: 10 } as File)).toBeNull();
  });
});
