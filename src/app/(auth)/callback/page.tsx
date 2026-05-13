"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code for tokens
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Token exchange failed");
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login?error=callback_failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-primary" />
        <p className="text-text-secondary">Completing sign in…</p>
      </div>
    </div>
  );
}
