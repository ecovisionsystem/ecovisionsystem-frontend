"use client";

import "@/lib/auth/amplify";
import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!expiresAt) return;

    const refreshTimeout = Math.max(expiresAt - Date.now() - 60_000, 0);
    const timer = window.setTimeout(() => {
      refreshSession();
    }, refreshTimeout);

    return () => window.clearTimeout(timer);
  }, [expiresAt, refreshSession]);

  return <>{children}</>;
}
