import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLElement>(thresh = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: thresh },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [thresh]);
  return [ref, inView] as const;
}

export function useMounted(delay = 80) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setM(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return m;
}

type CounterProps = {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

export function Counter({
  end,
  suffix = "",
  decimals = 0,
  duration = 2200,
}: CounterProps) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView<HTMLSpanElement>();
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    let id: ReturnType<typeof setInterval> | undefined;
    const step = end / (duration / 16);
    id = setInterval(() => {
      s += step;
      if (s >= end) {
        setVal(end);
        if (id) clearInterval(id);
      } else setVal(s);
    }, 16);
    return () => {
      if (id) clearInterval(id);
    };
  }, [inView, end, duration]);
  return (
    <span ref={ref}>
      {decimals ? val.toFixed(decimals) : Math.floor(val)}
      {suffix}
    </span>
  );
}

export function Fade({
  children,
  delay = 0,
  dir = "up",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "up" | "down" | "left" | "right" | "none";
  style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const map = {
    up: "translateY(28px)",
    down: "translateY(-20px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : map[dir],
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
