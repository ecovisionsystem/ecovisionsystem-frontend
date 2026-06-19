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

export function getApiAuthToken(accessToken?: string, idToken?: string) {
  const tokenType = process.env.NEXT_PUBLIC_API_AUTH_TOKEN_TYPE;
  return tokenType === "access" ? accessToken : idToken;
}
