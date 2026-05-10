"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKeeleSSO = async () => {
    setLoading(true);
    try {
      // Redirect to Keele SSO
      window.location.href = "/api/auth/sso/keele";
    } catch (err) {
      setError("Sign in with Keele SSO failed. Please try again.");
      setLoading(false);
    }
  };

  const handleNativeAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Sign in failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-primary mb-1">
            ecoVision 2.0
          </h1>
          <p className="text-sm text-text-secondary">
            UAV Vegetation Intelligence
          </p>
          <p className="text-xs text-text-muted mt-1">Keele University × AWS</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-bg border border-error rounded-md flex gap-2">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <Button
            onClick={handleKeeleSSO}
            loading={loading}
            className="w-full"
            size="md"
          >
            Sign in with Keele SSO
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">or</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleNativeAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="md"
            variant="secondary"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-text-muted">
          <p>v2.0 · eu-west-2 · Keele University</p>
        </div>
      </Card>
    </div>
  );
}
