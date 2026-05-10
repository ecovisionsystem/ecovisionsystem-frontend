"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AuthUser } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<"ecologist" | "researcher" | "developer" | "admin">;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ecologist", "researcher", "developer", "admin"],
  },
  {
    href: "/upload",
    label: "Upload",
    icon: Upload,
    roles: ["ecologist", "researcher", "developer", "admin"],
  },
  {
    href: "/results",
    label: "Results",
    icon: MapPin,
    roles: ["ecologist", "researcher", "developer", "admin"],
  },
  {
    href: "/admin",
    label: "Admin",
    icon: ShieldCheck,
    roles: ["admin", "developer"],
  },
];

interface AppSidebarProps {
  user: AuthUser | null;
  onSignOut: () => void;
  collapsed?: boolean;
}

export function AppSidebar({
  user,
  onSignOut,
  collapsed = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isSmallScreen);
      if (isSmallScreen) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter nav items based on user role
  const visibleItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div
        className={cn(
          "px-4 py-6 border-b border-border",
          isCollapsed && "py-4",
        )}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-brand-primary">
                ecoVision
              </h1>
              <p className="text-xs text-text-secondary">2.0</p>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-surface-overlay rounded transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <ChevronLeft
                className={cn("h-4 w-4", isCollapsed && "rotate-180")}
              />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
                  isActive
                    ? "bg-brand-muted text-brand-primary border-l-2 border-brand-primary"
                    : "text-text-secondary hover:bg-surface-overlay",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      {user && (
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-overlay transition-colors",
              mobileMenuOpen && "bg-surface-overlay",
            )}
          >
            <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user.role}
                </p>
              </div>
            )}
          </button>

          {mobileMenuOpen && (
            <button
              onClick={onSignOut}
              className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-bg rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && "Sign out"}
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-brand-primary text-white rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-surface border-r border-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "hidden md:flex",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobile && mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border z-40 flex flex-col md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
