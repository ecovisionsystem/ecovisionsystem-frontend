import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api-client";
import { uploadPreviewErrorMessage } from "@/lib/uploads";

describe("uploadPreviewErrorMessage", () => {
  it("identifies a backend that does not expose the preview route", () => {
    expect(uploadPreviewErrorMessage(new ApiError(404, "Not Found"))).toBe(
      "Image preview is not available on the connected backend yet.",
    );
  });

  it("distinguishes a missing upload record", () => {
    expect(
      uploadPreviewErrorMessage(new ApiError(404, "Upload not found")),
    ).toBe("This upload record is not available on the connected backend.");
  });

  it("keeps infrastructure failures safe", () => {
    expect(
      uploadPreviewErrorMessage(
        new ApiError(502, "Unable to create the S3 preview URL"),
      ),
    ).toBe("The image preview service is temporarily unavailable.");
  });
});


it.each(["500", "ClientError", "SQLAlchemy", "S3", "SQS", "ECS"])("does not expose raw preview failure %s", (diagnostic) => {
  expect(uploadPreviewErrorMessage(new Error(diagnostic))).toBe("The uploaded image preview could not be loaded.");
});
