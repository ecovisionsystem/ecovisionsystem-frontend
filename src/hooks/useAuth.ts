"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser } from "@/types";

export function useAuth() {
  const {
    user,
    claims,
    accessToken,
    idToken,
    expiresAt,
    isAuthenticated,
    isLoading,
    refreshSession,
    signOut,
  } = useAuthStore();

  const router = useRouter();

  const hasRole = (role: AuthUser["role"] | AuthUser["role"][]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const logout = async () => {
    await signOut();
    router.replace("/login");
  };

  const requireAuth = (redirectPath = "/login") => {
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace(redirectPath);
      }
    }, [isLoading, isAuthenticated, redirectPath, router]);
  };

  return {
    user,
    claims,
    accessToken,
    idToken,
    expiresAt,
    isAuthenticated,
    isLoading,
    refreshSession,
    signOut: logout,
    hasRole,
    requireAuth,
  };
}
