"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { T } from "@/styles/style";
import { AlertCircleIcon } from "lucide-react";
import { fetchAuthSession } from "aws-amplify/auth";
import "@/lib/auth/amplify";

export default function NotFound() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await fetchAuthSession();
        const hasToken = Boolean(session.tokens?.accessToken);

        setIsAuthenticated(hasToken);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  function handleNavigation() {
    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <AlertCircleIcon className="h-12 w-12 text-gray-400 mx-auto" />

        <h1 className="text-2xl font-semibold">Page not found</h1>

        <p className="text-gray-600">
          The page you are looking for does not exist. Please check the URL or
          return to the dashboard.
        </p>

        <Button
          className="w-full mt-3 text-sm uppercase rounded-sm tracking-widest transition-colors"
          size="md"
          style={{
            background: T.forest,
            cursor: "pointer",
            boxShadow: `0 3px 14px ${T.forest}40`,
          }}
          onClick={handleNavigation}
          disabled={isCheckingAuth}
        >
          {isCheckingAuth
            ? "Checking..."
            : isAuthenticated
              ? "Go to Dashboard"
              : "Go to Login"}
        </Button>
      </div>
    </main>
  );
}
