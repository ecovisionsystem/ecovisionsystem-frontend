// import { FlaskConical, ArrowRight, FileText } from "lucide-react";

import { useMounted } from "@/lib/utils/helpers";
import { T } from "@/styles/style";
import { useEffect, useRef, useState } from "react";

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

        {/* ── RIGHT — Live AI Panel ── */}
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

/* Live AI inference panel — right side of hero */
function HeroAIPanel() {
  const [tick, setTick] = useState(0);
  const [inferenceStep, setInferenceStep] = useState(0);
  const [confidence, setConfidence] = useState(Array(6).fill(0));

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setInferenceStep((s) => (s + 1) % 4);
      setConfidence(
        Array(6)
          .fill(0)
          .map(() => 0.85 + Math.random() * 0.13),
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const species = [
    {
      name: "Spartina maritima",
      color: "#4A9E1C",
      conf: confidence[0] || 0.96,
    },
    {
      name: "Puccinellia maritima",
      color: "#2B6B08",
      conf: confidence[1] || 0.93,
    },
    { name: "Mixed / Ecotone", color: "#8CC840", conf: confidence[2] || 0.88 },
    { name: "Bare substrate", color: "#B8A882", conf: confidence[3] || 0.97 },
    { name: "Water / Tidal", color: "#4A90B8", conf: confidence[4] || 0.99 },
  ];

  const inferenceStages = [
    "Encoding tiles…",
    "Segmenting…",
    "Classifying blobs…",
    "Scoring dominance…",
  ];

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
          ECOVISION — INFERENCE ENGINE v2.0
        </span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.lime,
              display: "inline-block",
              animation: "pulse 1.8s infinite",
            }}
          />
          <span style={{ fontSize: 9, color: T.lime, letterSpacing: "1px" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Main visual area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Simulated marsh canvas */}
        <MarshCanvas tick={tick} />

        {/* Scan line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg,transparent,${T.lime}CC,transparent)`,
            boxShadow: `0 0 16px ${T.lime}88`,
            animation: "scanLine 2.8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Confidence overlay */}
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
          {species.map((s, i) => (
            <div
              key={i}
              style={{ marginBottom: i < species.length - 1 ? 9 : 0 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.6)",
                    fontStyle: "italic",
                  }}
                >
                  {s.name}
                </span>
                <span style={{ fontSize: 10, color: s.color, fontWeight: 500 }}>
                  {(s.conf * 100).toFixed(1)}%
                </span>
              </div>
              <div
                style={{
                  height: 2,
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${s.conf * 100}%`,
                    background: s.color,
                    borderRadius: 2,
                    transition: "width 1.2s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Inference stage */}
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
          {inferenceStages.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: i < 3 ? 5 : 0,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    i < inferenceStep
                      ? T.lime
                      : i === inferenceStep
                        ? T.leaf
                        : "rgba(255,255,255,0.1)",
                  boxShadow: i === inferenceStep ? `0 0 8px ${T.leaf}` : "none",
                  transition: "all 0.4s ease",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color:
                    i <= inferenceStep
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.2)",
                  transition: "color 0.4s",
                }}
              >
                {s}
              </span>
              {i < inferenceStep && (
                <span
                  style={{ fontSize: 8, color: T.lime, marginLeft: "auto" }}
                >
                  ✓
                </span>
              )}
            </div>
          ))}
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
            {(0.68 + Math.sin(tick / 25) * 0.06).toFixed(2)}
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
        <LogStream tick={tick} />
      </div>
    </div>
  );
}

function MarshCanvas({ tick }: { tick: number }) {
  const blobs = useRef([
    {
      x: 12,
      y: 18,
      w: 28,
      h: 22,
      color: "rgba(74,158,28,0.4)",
      label: "S.mar",
      rx: 12,
    },
    {
      x: 44,
      y: 12,
      w: 32,
      h: 28,
      color: "rgba(43,107,8,0.35)",
      label: "P.mar",
      rx: 10,
    },
    {
      x: 78,
      y: 20,
      w: 22,
      h: 20,
      color: "rgba(74,158,28,0.38)",
      label: "S.mar",
      rx: 8,
    },
    {
      x: 10,
      y: 52,
      w: 30,
      h: 24,
      color: "rgba(140,200,64,0.28)",
      label: "Mix",
      rx: 14,
    },
    {
      x: 48,
      y: 55,
      w: 28,
      h: 22,
      color: "rgba(43,107,8,0.33)",
      label: "P.mar",
      rx: 10,
    },
    {
      x: 76,
      y: 48,
      w: 24,
      h: 26,
      color: "rgba(74,158,28,0.4)",
      label: "S.mar",
      rx: 8,
    },
    {
      x: 6,
      y: 75,
      w: 20,
      h: 18,
      color: "rgba(43,107,8,0.3)",
      label: "P.mar",
      rx: 8,
    },
    {
      x: 32,
      y: 72,
      w: 36,
      h: 20,
      color: "rgba(74,158,28,0.35)",
      label: "S.mar",
      rx: 12,
    },
    {
      x: 72,
      y: 70,
      w: 22,
      h: 24,
      color: "rgba(140,200,64,0.25)",
      label: "Mix",
      rx: 10,
    },
  ]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(/images/imgbg.png)`,
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      {/* Tonal terrain patches */}
      {[
        {
          t: "18%",
          l: "5%",
          w: "35%",
          h: "30%",
          bg: "radial-gradient(ellipse,rgba(40,80,15,0.5) 0%,transparent 80%)",
        },
        {
          t: "45%",
          l: "38%",
          w: "45%",
          h: "35%",
          bg: "radial-gradient(ellipse,rgba(30,60,10,0.55) 0%,transparent 80%)",
        },
        {
          t: "65%",
          l: "8%",
          w: "30%",
          h: "28%",
          bg: "radial-gradient(ellipse,rgba(35,70,12,0.45) 0%,transparent 80%)",
        },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.t,
            left: p.l,
            width: p.w,
            height: p.h,
            background: p.bg,
          }}
        />
      ))}

      {/* Segmentation blobs */}
      {blobs.current.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            background: b.color,
            border: `1px solid ${b.color.replace(/[\d.]+\)$/, "0.7)")}`,
            borderRadius: b.rx,
            animation: `fadeInPatch 0.6s ease ${0.8 + i * 0.12}s both`,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 4,
              left: 5,
              fontFamily: T.mono,
              fontSize: "clamp(6px,0.9vw,9px)",
              color: "rgba(255,255,255,0.8)",
              background: "rgba(0,0,0,0.55)",
              padding: "2px 5px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {b.label}
          </span>
        </div>
      ))}

      {/* Coordinate crosshair at center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 24,
          height: 24,
          border: `1px solid ${T.lime}88`,
          borderRadius: "50%",
          animation: "crosshairPulse 2s ease-in-out infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: `${T.lime}44`,
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: `${T.lime}44`,
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* Floating coordinate tags */}
      {[
        { top: "8%", left: "3%", text: "51.892°N 1.034°W" },
        { top: "8%", right: "3%", text: "GSD: 2.1 cm/px" },
        { bottom: "22%", left: "3%", text: "Alt: 30m AGL" },
      ].map((tag, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...tag,
            fontFamily: T.mono,
            fontSize: 8,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.5px",
          }}
        >
          {tag.text}
        </div>
      ))}
    </div>
  );
}

function LogStream({ tick }: { tick: number }) {
  const logs = [
    "tile_0024.png → SegFormer-B5 → mask_0024.pt",
    "blob_detection: 14 regions found | min_area=120px",
    "ConvNeXt: S.maritima=0.961 P.maritima=0.039",
    "dominance_score: zone_A=0.74 zone_B=0.52",
    "writing GeoJSON → output/survey_20240715.geojson",
    "MAE validation: 0.078 vs quadrat_ref_B3",
    "tile_0025.png → SegFormer-B5 → mask_0025.pt",
    "mIoU checkpoint: 0.941 | OA: 0.973",
  ];
  const idx = Math.floor(tick / 30) % logs.length;
  const log = logs[idx];
  return (
    <span>
      <span style={{ color: T.lime }}>› </span>
      {log}
      <span style={{ animation: "blink 1s step-end infinite" }}>_</span>
    </span>
  );
}
