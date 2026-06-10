export const remoteImages = {
  field:
    "https://images.unsplash.com/photo-1654643353343-27b4e11b10d6?w=600&q=80",
  satellite:
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80",
  collapse:
    "https://images.unsplash.com/photo-1718017670264-4d0497f8ac35?w=600&q=80",
  drone:
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=700&q=80",
  ai: "/images/segmen.png",
  earth:
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700&q=80",
  marsh: "/images/dominance.png",
  coast:
    "https://images.unsplash.com/photo-1440778303588-435521a205bc?w=600&q=80",
  biodiversity:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
  wetland:
    "https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&q=80",
  climate:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  invasive:
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&q=80",
  compliance:
    "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&q=80",
};

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
    <div
      className="lc-reveal"
      style={{ textAlign: centered ? "center" : "left" }}
    >
      <p
        className="lc-eyebrow"
        style={{ color: dark ? "var(--lc-lime)" : undefined }}
      >
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
        border: dark
          ? "1px solid rgba(255,255,255,.08)"
          : "1px solid var(--lc-bg3)",
        borderRadius: 20,
        boxShadow: dark ? undefined : "var(--lc-shadow)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
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
