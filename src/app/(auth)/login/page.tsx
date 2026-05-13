"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, InputLogin } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Cloud,
  GraduationCap,
  Landmark,
  Lock,
  Mail,
} from "lucide-react";

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
    // <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
    <div className="bg-[#F7F7F2] min-h-screen relative font-sans text-[#1A1A1A] selection:bg-[#E0E0D1] selection:text-[#1A1A1A] overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale opacity-50"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCCIJdz-FPJHv4XSeS2C-wxv_SHOfsnJYL-_bnwI_lfBj44dV91eXyH-RgP6vt4eW5BemPwaXC_4G1Hs7ucCbhcGaE-1OpgviVTd0htSOIKHzSfqUjaXg3nNZFTOnxJOsh_CADflpwMZ9W-w5tEYgGkCxdQsACd6elXhJuNzemvmfs_zp8C7hDt4ttR0U9ccXqH1RLI5KKmCOTn0OPcfqu2zVs1o2dZEYjMQL3KS2MSuH2KbWZOx2HS2hN4fZsFWzhA85gAMgNBg')",
        }}
      >
        {/* Overlay to ensure text readability and brand tint */}
        <div className="absolute inset-0 bg-[#F7F7F2]/85 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <a
                className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
                href="/"
              >
                <img
                  src="./branding/ecov2.png"
                  alt="Keele University logo"
                  className="h-10 object-contain"
                />
              </a>
            </div>
            <div className="text-center mb-8 border-b border-[#1A1A1A]/20 pb-6">
              <p className="text-sm text-text-secondary">
                UAV Vegetation Intelligence System (v2.0)
              </p>
            </div>
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
              className="w-full uppercase border rounded-none border-brand-primary text-[10px]  tracking-widest hover:bg-[#F7F7F2] hover:text-[#1A1A1A] focus:outline-none transition-colors"
              size="lg"
            >
              <GraduationCap size={16} strokeWidth={2} />
              Sign in with Keele SSO
            </Button>

            <div className="relative flex items-center pt-6">
              <div className="flex-grow border-t border-[#1A1A1A] opacity-30"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
                Or continue with
              </span>
              <div className="flex-grow border-t border-[#1A1A1A] opacity-30"></div>
            </div>
          </div>

          <form onSubmit={handleNativeAuth} className="">
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium uppercase tracking-widest text-text-primary mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="opacity-60" />
                </div>
                <InputLogin
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@keele.ac.uk"
                  disabled={loading}
                  required
                  className=""
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="opacity-60" />
                </div>
                <InputLogin
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-3 text-xs uppercase rounded-sm tracking-widest transition-colors"
              size="md"
              variant="secondary"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1A1A1A]/20 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-2">
              <Landmark size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Keele University
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Powered by AWS
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
