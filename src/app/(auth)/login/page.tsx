"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputLogin } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signIn, fetchAuthSession, confirmSignIn } from "aws-amplify/auth";
import { AlertCircle, Cloud, Landmark, Lock, Mail } from "lucide-react";
import { cx } from "class-variance-authority";
import { T } from "@/styles/style";
import next from "next";

function useLoaded() {
  const [loaded, setLoaded] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);
  return loaded;
}
function SSOBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "10px 8px",
        background: hov ? T.canvas : T.white,
        border: `1.5px solid ${hov ? T.moss + "55" : T.bark}`,
        borderRadius: 10,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        color: hov ? T.forest : T.fog,
        transition: "all .2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function KIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="currentColor"
      opacity=".7"
    >
      <path d="M3 2h2v5l5-5h3L8 8l5 6h-3L8 9l-3 3H3V2z" />
    </svg>
  );
}

function AIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity=".7"
    >
      <path d="M3 17.5C6 17.5 8.5 19 12 19s6-1.5 9-1.5" />
      <path d="M7 12.5l-1 5M17 12.5l1 5M8 7.5h8l1 5H7l1-5z" />
    </svg>
  );
}
type LoginStage = "SIGN_IN" | "NEW_PASSWORD_REQUIRED";

export default function LoginPage() {
  const loaded = useLoaded();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<LoginStage>("SIGN_IN");

  const emailFromInvite = useMemo(
    () => searchParams.get("email") ?? "",
    [searchParams],
  );

  useEffect(() => {
    if (emailFromInvite) {
      setEmail(emailFromInvite);
      setTab("signup");
    }
  }, [emailFromInvite]);

  const anim = (delay: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(14px)",
    transition: `opacity .65s ease ${delay}s, transform .65s cubic-bezier(.4,0,.2,1) ${delay}s`,
  });

  async function routeAfterSignIn() {
    const session = await fetchAuthSession();

    const idPayload = session.tokens?.idToken?.payload;
    const accessPayload = session.tokens?.accessToken?.payload;

    const groups =
      (idPayload?.["cognito:groups"] as string[] | undefined) ??
      (accessPayload?.["cognito:groups"] as string[] | undefined) ??
      [];

    if (
      groups.includes("Admins") ||
      groups.includes("Researcher") ||
      groups.includes("Developer") ||
      groups.includes("Ecologist")
    ) {
      router.replace("/dashboard");
    }
    router.replace("/unauthorized");
  }

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

  const { refreshSession } = useAuth();

  const handleNativeAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn({
        username: email,
        password,
      });

      const nextStage = result.nextStep.signInStep;

      if (nextStage === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setStage("NEW_PASSWORD_REQUIRED");
        setLoading(false);
        return;
      }

      if (nextStage === "DONE") {
        await routeAfterSignIn();
        return;
      }

      await refreshSession();
      setError(`Unsupported sign-in step: ${nextStage}`);
    } catch (err: {} | any) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function handleNewPassword(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmedPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      const nextStep = result.nextStep.signInStep;

      if (nextStep === "DONE") {
        await routeAfterSignIn();
        return;
      }

      setError(`Unsupported sign-in step: ${nextStep}`);
    } catch (err: {} | any) {
      setError(err?.message ?? "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (stage === "NEW_PASSWORD_REQUIRED") {
    return (
      <Card
        style={{
          ...anim(0.14),
          background: T.white,
          border: `1px solid ${T.bark}`,
          boxShadow:
            "0 2px 24px rgba(15,26,8,.06), 0 1px 3px rgba(15,26,8,.03)",
        }}
        className="w-full max-w-md rounded-[20px]"
      >
        <div style={{ marginBottom: 26 }}>
          <h1
            style={{
              fontFamily: T.sans,
              fontSize: 27,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-.7px",
              lineHeight: 1.15,
              marginBottom: 7,
            }}
          >
            Set New Password
          </h1>
          <p
            style={{
              fontFamily: T.sans,
              fontSize: 13.5,
              color: T.fog,
              lineHeight: 1.55,
            }}
          >
            Please enter a new password for your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-bg border border-error rounded-md flex gap-2">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleNewPassword}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-on-surface"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-input bg-background py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="opacity-60" />
              </div>
              <InputLogin
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="confirmedPassword"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="opacity-60" />
              </div>
              <InputLogin
                id="confirmedPassword"
                type="password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </Card>
    );
  }

  return (
    <div
      style={{
        background: T.canvas,
      }}
      className={cx(
        "min-h-screen relative font-sans text-[#1A1A1A]  selection:bg-[#E0E0D1] selection:text-[#1A1A1A] overflow-hidden",
      )}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${T.forest}12 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Ambient top glow */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 500,
          pointerEvents: "none",
          background: `radial-gradient(ellipse, ${T.leaf}09 0%, transparent 65%)`,
        }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 flex-col">
        <div className="flex justify-center mb-3">
          <a
            className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
            href="/"
          >
            <img
              src="./branding/eco2.png"
              alt="Keele University logo"
              className="h-10 object-contain"
            />
          </a>
        </div>
        <Card
          style={{
            ...anim(0.14),
            background: T.white,
            border: `1px solid ${T.bark}`,
            boxShadow:
              "0 2px 24px rgba(15,26,8,.06), 0 1px 3px rgba(15,26,8,.03)",
          }}
          className="w-full max-w-md rounded-[20px]"
        >
          <div style={{ marginBottom: 26 }}>
            <h1
              style={{
                fontFamily: T.sans,
                fontSize: 27,
                fontWeight: 700,
                color: T.ink,
                letterSpacing: "-.7px",
                lineHeight: 1.15,
                marginBottom: 7,
              }}
            >
              {tab === "signin" ? "Welcome back." : "Create account."}
            </h1>
            <p
              style={{
                fontFamily: T.sans,
                fontSize: 13.5,
                color: T.fog,
                lineHeight: 1.55,
              }}
            >
              {tab === "signin"
                ? "Sign in to your research environment."
                : "Join the EcoVision research platform."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error-bg border border-error rounded-md flex gap-2">
              <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              background: T.canvas,
              borderRadius: 9,
              padding: 3,
              marginBottom: 26,
              border: `1px solid ${T.bark}`,
            }}
          >
            {[
              ["signin", "Sign In"],
              ["signup", "Sign Up (soon)"],
            ].map(([key, label]) => (
              <button
                key={key}
                disabled={key === "signup" ? true : undefined}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tab === key ? T.forest : T.fog,
                  background: tab === key ? T.white : "transparent",
                  border: "none",
                  borderRadius: 7,
                  cursor: "pointer",
                  boxShadow:
                    tab === key ? "0 1px 5px rgba(15,26,8,.07)" : "none",
                  transition: "all .22s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
            <SSOBtn icon={<KIcon />} label="Keele SSO" />
            <SSOBtn icon={<AIcon />} label="AWS IAM" />
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: T.bark }} />
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 11,
                color: T.dark,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: T.bark }} />
          </div>

          {done ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                animation: "fadeUp .4s ease both",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: `${T.leaf}16`,
                  margin: "0 auto 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.moss}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: T.serif,
                  fontSize: 17,
                  color: T.ink,
                  marginBottom: 5,
                }}
              >
                You're signed in.
              </p>
              <p
                style={{
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: T.fog,
                }}
              >
                Redirecting to dashboard…
              </p>
            </div>
          ) : (
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
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 12.5,
                      color: T.moss,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "color .2s",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-3 text-sm uppercase rounded-sm tracking-widest transition-colors"
                size="md"
                style={{
                  background: loading ? T.moss : T.forest,
                  cursor: loading ? "default" : "pointer",
                  boxShadow: `0 3px 14px ${T.forest}40`,
                }}
              >
                {loading ? "Authenticating..." : "Sign in"}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#1A1A1A]/20 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-2">
              <Landmark size={14} />
              <span className="text-[8px] font-bold  tracking-widest">
                Keele University
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud size={14} />
              <span className="text-[8px] font-bold  tracking-widest">
                Powered by AWS
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
