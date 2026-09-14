// import { FlaskConical, ArrowRight, FileText } from "lucide-react";

import { useMounted } from "@/lib/utils/helpers";
import { T } from "@/styles/style";
import { useState } from "react";

//
export default function Hero() {
  const mounted = useMounted(120);

  const trust = [
    {
      name: "Keele University",
      abbr: "KU",
      image: "/branding/logo-Keele.png",
      width: 120,
    },
    { name: "AWS", abbr: "AWS", image: "/branding/awslg.svg.png", width: 80 },
  ];

  return (
    <section
      style={{
        minHeight: "100vh",
        background: T.cream,
        paddingBottom: 120,
      }}
    >
      <div
        className="container mx-auto w-full"
        style={{
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* Subtle grid */}
        <div
          className="flex w-full justify-center"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.9,
            backgroundImage: `linear-gradient(rgba(43,77,14,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(43,77,14,0.05) 1px,transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 80%)",
          }}
        />
        {/* ── LEFT ── */}

        <div
          style={{
            padding: "80px 56px 10px 56px",
            position: "relative",
            zIndex: 2,
          }}
          className="flex justify-center text-center w-full"
        >
          <div className=" flex flex-col justify-center items-center">
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(12px)",
                transition: "all 0.6s ease 0.1s",
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  fontWeight: 500,
                  color: T.leaf,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  paddingBottom: 2,
                }}
              >
                The Future of Ecological Intelligence
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: T.serif,
                fontSize: "clamp(40px,7vw,90px)",
                color: T.ink,
                lineHeight: 1.04,
                letterSpacing: "-2.5px",
                margin: "0 0 28px",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(24px)",
                transition: "all 0.8s cubic-bezier(.22,1,.36,1) 0.2s",
              }}
            >
              <span className="font-medium">
                Salt Marsh Intelligence Infrastructure{" "}
              </span>{" "}
              <br />
              for{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "transparent",
                  backgroundImage: `linear-gradient(120deg, ${T.moss} 0%, ${T.leaf} 45%, ${T.lime} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                the Next Century.
              </span>
            </h1>

            {/* Body */}
            <p
              className="sm:max-w-[480px] md:max-w-[620px]"
              style={{
                fontFamily: T.sans,
                fontSize: 16,
                color: "#5A5A4A",
                lineHeight: 1.75,
                margin: "0 0 40px",
                fontWeight: 400,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(16px)",
                transition: "all 0.8s ease 0.4s",
              }}
            >
              <span
                style={{
                  color: T.leaf,
                  fontFamily: T.serif,
                  fontStyle: "italic",
                }}
              >
                <strong> ecoVision </strong>
              </span>{" "}
              combines UAV imaging, transformer-based computer vision, and
              ecological modelling to automate species-level vegetation
              monitoring across vulnerable ecosystems, grounded in peer-reviewed
              research at Keele University.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 52,
                opacity: mounted ? 1 : 0,
                transition: "all 0.7s ease 0.55s",
              }}
            >
              <HeroBtn primary href="/dashboard">
                Explore the Platform →
              </HeroBtn>
              <HeroBtn href="/dashboard">View Research Architecture</HeroBtn>
              <HeroBtn ghost href="/dashboard">
                Request Partnership
              </HeroBtn>
            </div>

            {/* Trust bar */}
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transition: "all 0.7s ease 0.7s",
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 9,
                  color: "#aaa",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Powered by
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {trust.map((t) => (
                  <div
                    className="flex flex-col gap-1 items-center justify-center"
                    key={t.abbr}
                    style={{
                      fontFamily: T.sans,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#888",
                      borderRadius: 8,
                      padding: "6px 14px",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {t.image && (
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{ width: t.width, marginRight: 8 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Analysis Preview ── */}
        <div
          style={{
            height: "90vh",
            position: "relative",
            overflow: "hidden",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 0.6s",
          }}
          className="rounded-[42px] border-[8px] border-black"
        >
          <div
            className="rounded-[35px] border-[4px] border-slate-300"
            style={{
              height: "88vh",
              position: "relative",
              overflow: "hidden",
              opacity: mounted ? 1 : 0,
              transition: "opacity 1s ease 0.6s",
            }}
          >
            <HeroAIPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBtn({
  children,
  primary,
  ghost,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  ghost?: boolean;
  href?: string;
}) {
  const [hov, setHov] = useState(false);
  const base = {
    fontFamily: T.sans,
    fontSize: 13.5,
    fontWeight: 600,
    padding: "11px 24px",
    borderRadius: 100,
    cursor: "pointer",
    border: "none",
    transition: "all 0.25s",
    letterSpacing: "0.1px",
  };
  if (primary)
    return (
      <a
        href={href}
        style={{
          ...base,
          color: "#fff",
          background: hov ? T.leaf : T.moss,
          boxShadow: hov ? `0 8px 28px ${T.moss}55` : `0 2px 16px ${T.moss}33`,
          transform: hov ? "translateY(-2px)" : "none",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </a>
    );
  if (ghost)
    return (
      <a
        href={href}
        style={{
          ...base,
          color: T.moss,
          background: "transparent",
          border: `1px solid ${hov ? T.moss : "rgba(43,77,14,0.25)"}`,
          padding: "10px 20px",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </a>
    );
  return (
    <a
      href={href}
      style={{
        ...base,
        color: T.ink,
        background: hov ? T.warm : "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
}

/* Analysis preview shell; no job is selected on the public landing page. */
function HeroAIPanel() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(170deg, #0E1409 0%, #111D07 55%, #0A1305 100%)`,
        display: "flex",
        flexDirection: "column",
        fontFamily: T.mono,
      }}
    >
      {/* Topbar chrome */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "1px",
            background: "rgba(255,255,255,0.07)",
            padding: "5px 100px",
            borderRadius: 20,
          }}
        >
          ECOVISION — ANALYSIS PREVIEW
        </span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.lime,
              display: "inline-block",

            }}
          />
          <span style={{ fontSize: 9, color: T.lime, letterSpacing: "1px" }}>
            PREVIEW
          </span>
        </div>
      </div>

      {/* Main visual area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/50">
          No image selected. Open a project to upload and analyse an image.
        </div>

        {/* Confidence availability */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(16px)",
            borderRadius: 12,
            padding: "16px 18px",
            minWidth: 210,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Species Confidence
          </div>
          <p className="text-xs text-white/50">No confidence data available.</p>
        </div>

        {/* Analysis availability */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(16px)",
            borderRadius: 10,
            padding: "12px 16px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              marginBottom: 6,
            }}
          >
            PIPELINE STATUS
          </div>
          <p className="text-xs text-white/50">No analysis selected.</p>
        </div>

        {/* Dominance score pill */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            background: `linear-gradient(135deg,${T.moss},${T.leaf})`,
            borderRadius: 10,
            padding: "10px 16px",
            boxShadow: `0 4px 20px ${T.moss}55`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "1px",
              marginBottom: 3,
            }}
          >
            DOMINANCE INDEX
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 26,
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            —
          </div>
        </div>
      </div>

      {/* Log strip */}
      <div
        style={{
          padding: "10px 20px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(0,0,0,0.3)",
          fontFamily: T.mono,
          fontSize: 9,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.5px",
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        Open a completed analysis to view its saved results.
      </div>
    </div>
  );
}
