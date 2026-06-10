"use client";

import React, { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export function Fade({
  children,
  delay = 0,
  dir = "up",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "up" | "down" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView();
  const transforms = {
    up: "translateY(28px)",
    down: "translateY(-20px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    none: "none",
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[dir],
        transition: `opacity .75s ease ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Counter({
  end,
  suffix = "",
  decimals = 0,
  duration = 2200,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const [ref, inView] = useInView(0.5);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = end / (duration / 16);
    const interval = window.setInterval(() => {
      current += step;
      if (current >= end) {
        setValue(end);
        window.clearInterval(interval);
      } else {
        setValue(current);
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [duration, end, inView]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {decimals ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </span>
  );
}

export function HoverButton({
  children,
  primary,
  ghost,
}: {
  children: React.ReactNode;
  primary?: boolean;
  ghost?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const base: React.CSSProperties = {
    fontFamily: "var(--lcv2-sans)",
    fontSize: primary ? 15 : 14,
    fontWeight: primary ? 600 : 500,
    padding: primary ? "14px 32px" : "13px 24px",
    borderRadius: 999,
    cursor: "pointer",
    transition: "all .25s",
  };

  if (primary) {
    return (
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...base,
          color: "var(--lcv2-dark)",
          background: hovered ? "var(--lcv2-glow)" : "var(--lcv2-lime)",
          border: "none",
          transform: hovered ? "translateY(-2px)" : "none",
          boxShadow: hovered
            ? "0 8px 32px rgba(108,192,42,.45)"
            : "0 4px 20px rgba(108,192,42,.28)",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...base,
        color: hovered ? "#fff" : ghost ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.65)",
        background: ghost ? "transparent" : hovered ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.04)",
        border: `1px solid ${hovered ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.12)"}`,
      }}
    >
      {children}
    </button>
  );
}
