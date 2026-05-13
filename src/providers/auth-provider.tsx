"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setLoading, setUser, clearUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session token from cookies (httpOnly cookie set by server)
        // Try to fetch current user info from API
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
