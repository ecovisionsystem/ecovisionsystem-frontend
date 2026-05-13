"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import type { AuthUser } from "@/types";

interface AppShellProps {
  children: ReactNode;
  user: AuthUser | null;
  onSignOut: () => void;
  collapsed?: boolean;
}

export function AppShell({
  children,
  user,
  onSignOut,
  collapsed = false,
}: AppShellProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <AppSidebar user={user} onSignOut={onSignOut} collapsed={collapsed} />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          !isMobile && !collapsed && "ml-64",
          !isMobile && collapsed && "ml-16",
        )}
      >
        {children}
      </main>
    </div>
  );
}
