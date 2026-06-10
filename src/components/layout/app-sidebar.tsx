"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Folder,
  FolderPlus,
  LayoutDashboard,
  List,
  MapPin,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AuthUser } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<AuthUser["role"]>;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ecologist", "researcher", "developer", "Developer", "admin"],
  },
  {
    href: "/results",
    label: "Results",
    icon: MapPin,
    roles: ["ecologist", "researcher", "developer", "Developer", "admin"],
  },
  {
    href: "/admin",
    label: "Admin",
    icon: ShieldCheck,
    roles: ["admin", "developer", "Developer"],
  },
];

const projectItems: NavItem[] = [
  {
    href: "/dashboard/projects/new",
    label: "New Project",
    icon: FolderPlus,
    roles: ["ecologist", "researcher", "developer", "Developer", "admin"],
  },
  {
    href: "/dashboard/projects",
    label: "All Projects",
    icon: List,
    roles: ["ecologist", "researcher", "developer", "Developer", "admin"],
  },
];

interface AppSidebarProps {
  user: AuthUser | null;
  onSignOut: () => void;
  collapsed?: boolean;
}

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const visibleItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];
  const visibleProjectItems = user
    ? projectItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-brand-primary p-2 text-white shadow-sm md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-border bg-surface md:flex">
        <SidebarContent
          user={user}
          visibleItems={visibleItems}
          visibleProjectItems={visibleProjectItems}
          pathname={pathname}
          onSignOut={onSignOut}
        />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-surface shadow-xl md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-md p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              user={user}
              visibleItems={visibleItems}
              visibleProjectItems={visibleProjectItems}
              pathname={pathname}
              onSignOut={onSignOut}
            />
          </aside>
        </>
      )}
    </>
  );
}

interface SidebarContentProps {
  user: AuthUser | null;
  visibleItems: NavItem[];
  visibleProjectItems: NavItem[];
  pathname: string;
  onSignOut: () => void;
}

function SidebarContent({
  user,
  visibleItems,
  visibleProjectItems,
  pathname,
  onSignOut,
}: SidebarContentProps) {
  return (
    <>
      <div className="border-b border-border px-5 py-6">
        <h1 className="text-lg font-semibold text-brand-primary">ecoVision</h1>
        <p className="text-xs text-text-secondary">2.0</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {visibleItems.slice(0, 1).map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-muted text-brand-primary"
                    : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {visibleProjectItems.length > 0 && (
            <div className="pt-2">
              <div className="mb-1 flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                <Folder className="h-4 w-4" />
                <span>Projects</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </div>
              <div className="space-y-1">
                {visibleProjectItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard/projects"
                      ? pathname.startsWith(item.href) &&
                        !pathname.startsWith("/dashboard/projects/new")
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "ml-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-muted text-brand-primary"
                          : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {visibleItems.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-muted text-brand-primary"
                    : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {user && (
        <div className="border-t border-border p-3">
          <div className="mb-3 flex items-center gap-3 rounded-md px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {user.name}
              </p>
              <p className="truncate text-xs capitalize text-text-secondary">
                {user.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error-bg"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
