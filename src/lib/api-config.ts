"use client";

export function getApiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured. Set it to your FastAPI origin, for example https://api.ecovisions.co.uk.",
    );
  }

  return apiBaseUrl.replace(/\/$/, "");
}

export function getOptionalApiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  return apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : null;
}
