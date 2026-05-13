import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoVision 2.0",
  description: "UAV Vegetation Intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-surface text-text-primary")}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
