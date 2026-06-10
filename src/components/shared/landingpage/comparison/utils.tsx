"use client";

import React, { useEffect, useRef, useState } from "react";

export function useLandingReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".lc-reveal,.lc-reveal-left,.lc-reveal-right",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function Counter({
  to,
  suffix = "",
  decimals = 0,
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start: number | null = null;

        const tick = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Number((to * eased).toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [decimals, duration, to]);

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  dark,
  centered,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
  centered?: boolean;
}) {
  return (
    <div className="lc-reveal" style={{ textAlign: centered ? "center" : "left" }}>
      <p className="lc-eyebrow" style={{ color: dark ? "var(--lc-lime)" : undefined }}>
        {eyebrow}
      </p>
      <h2
        className="lc-heading"
        style={{
          color: dark ? "var(--lc-white)" : undefined,
          fontSize: "clamp(36px,4.2vw,60px)",
          marginBottom: subtitle ? 16 : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="lc-sub"
          style={{
            maxWidth: centered ? 680 : 540,
            margin: centered ? "0 auto" : undefined,
            color: dark ? "rgba(255,255,255,.55)" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function TechBadge({ children }: { children: React.ReactNode }) {
  return <span className="lc-tech-badge">{children}</span>;
}

export function Pill({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className="lc-pill"
      style={{
        background: dark ? "rgba(125,209,58,.16)" : "rgba(125,209,58,.12)",
        border: "1px solid rgba(125,209,58,.25)",
        color: dark ? "var(--lc-lime)" : "var(--lc-canopy)",
      }}
    >
      {children}
    </span>
  );
}

export function ShellCard({
  children,
  className = "lc-reveal lc-card-hover",
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        background: dark ? "rgba(255,255,255,.04)" : "var(--lc-white)",
        border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid var(--lc-bg3)",
        borderRadius: 20,
        boxShadow: dark ? undefined : "var(--lc-shadow)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
