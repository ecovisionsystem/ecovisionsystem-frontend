"use client";

import React, { useState } from "react";
import { T } from "@/styles/style";
import { Fade, HoverButton, useInView } from "./utils";

const images = {
  wetland:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80&auto=format",
  satellite:
    "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&q=80&auto=format",
  climate:
    "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80&auto=format",
  drone:
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80&auto=format",
  marsh:
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80&auto=format",
};

export default function LandingComparisonV2Sections() {
  return (
    <div className="landing-comparison-v2">
      <V2MetricsStrip />
      <GlobalProblem />
      <V2Solution />
      <Research />
      <V2Architecture />
      <LiveDemo />
      <V2Impact />
      <WhyNow />
      <V2Roadmap />
      <V2Team />
      {/* <FundingCTA /> */}
    </div>
  );
}

function V2MetricsStrip() {
  const [ref, inView] = useInView();
  const stats = [
    { lbl: "Pixel Accuracy", sub: "SegFormer-B5" },
    { lbl: "Species Classification", sub: "ConvNeXt-Base" },
    { lbl: "Dominance Error (MAE)", sub: "Not yet verified" },
    { lbl: "Ground Sampling Distance", sub: "UAV imagery" },
    { lbl: "Survey Speed vs. Manual", sub: "Per hectare" },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: T.dark,
        borderTop: "1px solid rgba(255,255,255,.04)",
      }}
    >
      <div
        className="lcv2-container grid grid-cols-1 md:grid-cols-5"
        style={{ padding: "56px" }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.lbl}
            style={{
              textAlign: "center",
              padding: "20px 0",
              borderRight:
                index < stats.length - 1
                  ? "1px solid rgba(255,255,255,.06)"
                  : "none",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(20px)",
              transition: `all .6s ease ${index * 0.1}s`,
            }}
          >
            <div
              style={{
                fontFamily: T.serif,
                fontSize: 48,
                color: "#fff",
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              —
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.55)",
                marginTop: 6,
              }}
            >
              {stat.lbl}
            </div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 9,
                color: T.lime,
                marginTop: 3,
                letterSpacing: 1,
              }}
            >
              Not yet verified
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GlobalProblem() {
  const problems = [
    {
      n: "01",
      title: "Manual surveys don't scale",
      image: images.wetland,
      points: [
        "Expensive field operations",
        "Spatially limited zones",
        "Observer inconsistency",
        "Slow repeat cycles",
      ],
    },
    {
      n: "02",
      title: "Satellites lack ecological granularity",
      image: images.satellite,
      points: [
        "10m resolution misses species",
        "Cloud disruption",
        "No sub-canopy discrimination",
        "Limited revisit flexibility",
      ],
    },
    {
      n: "03",
      title: "Ecosystems are changing faster than we can measure",
      image: images.climate,
      points: [
        "Annual zonation shifts",
        "Intertidal erosion",
        "Carbon baselines missing",
        "Policy lags ecology",
      ],
    },
  ];

  return (
    <section className="lcv2-section" style={{ background: T.darkMid }}>
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker" style={{ color: T.lime }}>
            The Problem
          </p>
          <h2 className="lcv2-title" style={{ color: "#fff", maxWidth: 760 }}>
            Ecological monitoring has not scaled with environmental collapse.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.42)",
              maxWidth: 620,
              lineHeight: 1.7,
              marginTop: 20,
              marginBottom: 72,
            }}
          >
            Three structural failures leave conservation agencies flying blind
            at the worst possible moment.
          </p>
        </Fade>

        <Fade delay={0.1} style={{ marginBottom: 64 }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ["90%", "of biodiversity monitoring remains manual", T.lime],
              ["Weeks", "to months for traditional analysis", "#F5A623"],
              ["2cm", "UAV imagery exceeds survey fidelity", "#4AB8D4"],
            ].map(([value, text, color]) => (
              <div
                key={value}
                className="lcv2-dark-card"
                style={{
                  borderRadius: 16,
                  padding: "28px 24px",
                  borderTop: `2px solid ${color}`,
                }}
              >
                <div
                  style={{
                    fontFamily: T.serif,
                    fontSize: 40,
                    color,
                    marginBottom: 10,
                  }}
                >
                  {value}
                </div>
                <div style={{ color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </Fade>

        <div className="space-y-4">
          {problems.map((problem, index) => (
            <Fade key={problem.title} delay={index * 0.1}>
              <div className="grid grid-cols-1 overflow-hidden rounded-[20px] border border-white/10 lg:grid-cols-[1fr_1.4fr]">
                <div
                  style={{
                    padding: "48px 44px",
                    background: "rgba(255,255,255,.02)",
                    order: index % 2 === 0 ? 0 : 1,
                  }}
                >
                  <p className="lcv2-kicker" style={{ color: T.lime }}>
                    Problem {problem.n}
                  </p>
                  <h3
                    style={{
                      fontFamily: T.serif,
                      fontSize: 28,
                      color: "#fff",
                      marginBottom: 20,
                    }}
                  >
                    {problem.title}
                  </h3>
                  <div className="space-y-2">
                    {problem.points.map((point) => (
                      <div key={point} className="flex gap-3">
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,.3)",
                            marginTop: 9,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            color: "rgba(255,255,255,.5)",
                            lineHeight: 1.6,
                          }}
                        >
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    minHeight: 260,
                    position: "relative",
                    overflow: "hidden",
                    order: index % 2 === 0 ? 1 : 0,
                  }}
                >
                  <img
                    src={problem.image}
                    alt=""
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(.55) saturate(.7)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg,rgba(14,20,9,.6),transparent 60%)",
                    }}
                  />
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function V2Solution() {
  const [active, setActive] = useState(0);
  const steps = [
    {
      n: "01",
      tag: "UAV Acquisition",
      headline: "Ultra-high-resolution drone imaging",
      body: "DJI Phantom 4 Pro flown at 30m AGL delivers 2 cm/px RGB orthomosaics with systematic grid coverage.",
      metrics: [
        "30m AGL flight altitude",
        "2 cm/px GSD",
        "80% image overlap",
        "RGB + multispectral ready",
      ],
      image: images.drone,
      color: T.lime,
    },
    {
      n: "02",
      tag: "AI Perception Layer",
      headline: "SegFormer-based semantic segmentation",
      body: "A hierarchical Mix Transformer backbone turns tiled imagery into vegetation masks at operational speed.",
      metrics: [
        "SegFormer-B5 backbone",
        "512x512 tiles",
        "mIoU not yet verified",
        "ADE20K pre-training",
      ],
      color: T.leaf,
    },
    {
      n: "03",
      tag: "Species Intelligence",
      headline: "ConvNeXt species classification",
      body: "Blob-level classification resolves species identity and ecotone ambiguity with high confidence.",
      metrics: [
        "ConvNeXt-Base",
        "Blob-level verification",
        "Accuracy not yet verified",
        "Ecotone disambiguation",
      ],
      color: "#4AB8D4",
    },
    {
      n: "04",
      tag: "Ecological Inference",
      headline: "Dominance scoring and geospatial analysis",
      body: "Purpose-built ecological metrics produce geospatial outputs for reporting and field validation.",
      metrics: [
        "Vegetated-area normalised",
        "MAE not yet verified",
        "GeoJSON export",
        "Per-polygon scoring",
      ],
      color: "#E8834A",
    },
  ];
  const step = steps[active];

  return (
    <section
      id="science-v2"
      className="lcv2-section"
      style={{ background: T.cream }}
    >
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker">The Solution</p>
          <h2 className="lcv2-title" style={{ maxWidth: 680 }}>
            From drone imagery to ecological intelligence.
          </h2>
        </Fade>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
          <div className="space-y-1">
            {steps.map((item, index) => (
              <Fade key={item.n} delay={index * 0.06} dir="left">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: active === index ? "#fff" : "transparent",
                    border: `1px solid ${active === index ? "rgba(0,0,0,.08)" : "transparent"}`,
                    borderLeft: `3px solid ${active === index ? item.color : "transparent"}`,
                    boxShadow:
                      active === index ? "0 4px 20px rgba(0,0,0,.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 9,
                      color: active === index ? item.color : "#aaa",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Step {item.n}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: active === index ? T.ink : "#777",
                    }}
                  >
                    {item.tag}
                  </div>
                </button>
              </Fade>
            ))}
          </div>
          <Fade delay={0.15}>
            <div
              className="overflow-hidden rounded-[20px] border bg-white shadow-xl"
              style={{ borderColor: "rgba(0,0,0,.06)" }}
            >
              {step.image && (
                <div
                  style={{
                    height: 220,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={step.image}
                    alt=""
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg,transparent 50%,#fff)",
                    }}
                  />
                </div>
              )}
              <div style={{ padding: "36px 40px" }}>
                <p className="lcv2-kicker" style={{ color: step.color }}>
                  {step.tag}
                </p>
                <h3
                  style={{
                    fontFamily: T.serif,
                    fontSize: 30,
                    color: T.ink,
                    marginBottom: 16,
                  }}
                >
                  {step.headline}
                </h3>
                <p
                  style={{ color: "#666", lineHeight: 1.75, marginBottom: 28 }}
                >
                  {step.body}
                </p>
                <div className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2">
                  {step.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-2">
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: step.color,
                        }}
                      />
                      <span style={{ color: "#555", fontSize: 13 }}>
                        {metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

function Research() {
  const contributions = [
    "Transformer Segmentation",
    "UAV Species Intelligence",
    "Dominance Mapping",
    "Ecological AI Infrastructure",
    "Spatial Aggregation Systems",
    "Real-Time Environmental AI",
  ];

  return (
    <section className="lcv2-section" style={{ background: T.paper }}>
      <div className="lcv2-container grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <Fade>
            <p className="lcv2-kicker">Scientific Foundation</p>
            <h2 className="lcv2-title">
              Built on peer-reviewed ecological and AI research.
            </h2>
            <p style={{ color: "#666", lineHeight: 1.75, marginTop: 24 }}>
              Every metric is grounded in methodology and positioned for
              institutional deployment.
            </p>
          </Fade>
          <Fade delay={0.15}>
            <div className="mt-9 grid grid-cols-2 gap-3">
              {[
                ["—", "Pixel accuracy · unverified"],
                ["—", "Species classification · unverified"],
                ["—", "Mean IoU · unverified"],
                ["—", "Dominance MAE · unverified"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="lcv2-card"
                  style={{ padding: "20px 22px" }}
                >
                  <div
                    style={{ fontFamily: T.serif, fontSize: 36, color: T.lime }}
                  >
                    {value}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
        <div className="space-y-3">
          {contributions.map((title, index) => (
            <Fade key={title} delay={index * 0.07} dir="right">
              <div
                className="lcv2-card flex gap-4"
                style={{ padding: "22px 24px" }}
              >
                <span style={{ color: T.leaf, fontSize: 18 }}>◈</span>
                <div>
                  <h3 style={{ fontWeight: 700, color: T.ink }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>
                    Second-script comparison content preserved for visual
                    review.
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function V2Architecture() {
  const layers: Array<{ label: string; color: string; nodes: string[] }> = [
    {
      label: "Frontend Intelligence",
      color: "#4AB8D4",
      nodes: [
        "Next.js 14",
        "Cognito SSO",
        "Presigned S3 Uploads",
        "CloudFront CDN",
      ],
    },
    {
      label: "AI Inference Layer",
      color: T.lime,
      nodes: ["SegFormer-B5", "ConvNeXt-Base", "MAPIE", "PyTorch 2.x"],
    },
    {
      label: "Cloud Infrastructure",
      color: "#F5A623",
      nodes: ["AWS ECS", "Lambda Pipelines", "SQS Queues", "EC2 GPU Fleet"],
    },
    {
      label: "Research Compute",
      color: "#C06BE8",
      nodes: ["Keele HPC", "SLURM", "MLflow", "DVC"],
    },
  ];

  return (
    <section
      id="architecture-v2"
      className="lcv2-section"
      style={{ background: T.dark }}
    >
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker" style={{ color: T.lime }}>
            Technology Architecture
          </p>
          <h2 className="lcv2-title" style={{ color: "#fff", maxWidth: 700 }}>
            Institutional-grade AI infrastructure.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.42)",
              maxWidth: 580,
              lineHeight: 1.7,
              marginTop: 20,
              marginBottom: 72,
            }}
          >
            Four tightly integrated layers from field acquisition to ecological
            intelligence delivery.
          </p>
        </Fade>
        <Fade delay={0.1}>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
            {layers.map(({ label, color, nodes }, index) => (
              <div
                key={label}
                className="lcv2-dark-card"
                style={{
                  borderTop: `2px solid ${color}`,
                  padding: "28px 22px",
                  borderRadius:
                    index === 0
                      ? "16px 0 0 16px"
                      : index === 3
                        ? "0 16px 16px 0"
                        : 0,
                }}
              >
                <p className="lcv2-kicker" style={{ color }}>
                  {label}
                </p>
                <div className="space-y-2">
                  {nodes.map((node) => (
                    <div
                      key={node}
                      style={{
                        fontFamily: T.mono,
                        fontSize: 10,
                        color: "rgba(255,255,255,.5)",
                        background: "rgba(255,255,255,.04)",
                        borderRadius: 6,
                        padding: "5px 10px",
                      }}
                    >
                      {node}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

function LiveDemo() {
  const [view, setView] = useState("segmentation");

  return (
    <section className="lcv2-section" style={{ background: T.paper }}>
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker">Analysis views</p>
          <h2 className="lcv2-title" style={{ maxWidth: 620 }}>
            Explore your saved analysis results.
          </h2>
        </Fade>
        <Fade delay={0.1}>
          <div
            className="my-6 flex w-fit flex-wrap gap-1 rounded-[14px] p-1"
            style={{ background: T.warm }}
          >
            {["segmentation", "heatmap", "confidence", "beforeafter"].map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setView(tab)}
                  style={{
                    fontSize: 12,
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: view === tab ? "#fff" : "transparent",
                    color: view === tab ? T.ink : "#888",
                  }}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </Fade>
        <Fade delay={0.15}>
          <div className="overflow-hidden rounded-[20px] border shadow-2xl">
            <div
              className="flex items-center gap-2 border-b p-3"
              style={{ background: T.warm }}
            >
              {["#FF5F57", "#FFBD2E", "#28C840"].map((color) => (
                <span
                  key={color}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
              ))}
              <div
                className="flex-1 text-center"
                style={{ fontFamily: T.mono, fontSize: 11, color: "#888" }}
              >
                ecovision.app/inference - {view}
              </div>
              <a href="/dashboard/projects" style={{ fontFamily: T.mono, fontSize: 10, color: T.moss, border: `1px solid ${T.moss}`, borderRadius: 8, padding: "4px 12px" }}>
                Open project
              </a>
            </div>
            <div
              style={{
                height: 480,
                background: T.dark,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/60">
                No {view} result selected. Open a completed analysis to view its saved artifacts.
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

function V2Impact() {
  const apps = [
    "Coastal Monitoring",
    "Biodiversity Intelligence",
    "Wetland Conservation",
    "Climate Adaptation",
    "Invasive Species Detection",
    "Environmental Compliance",
    "Habitat Restoration",
    "Ecological Forecasting",
  ];
  return (
    <section
      id="impact-v2"
      className="lcv2-section"
      style={{ background: T.cream }}
    >
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker">Impact</p>
          <h2 className="lcv2-title" style={{ maxWidth: 760 }}>
            Built for governments, researchers, and climate infrastructure.
          </h2>
        </Fade>
        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {apps.map((app, index) => (
            <Fade key={app} delay={index * 0.05}>
              <div
                className="lcv2-card h-full"
                style={{ padding: "24px 22px" }}
              >
                <div style={{ fontSize: 22, marginBottom: 12 }}>⬡</div>
                <h3 style={{ fontWeight: 700, color: T.ink, marginBottom: 8 }}>
                  {app}
                </h3>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6 }}>
                  Mission-critical application preserved from the second script
                  for comparison.
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNow() {
  const forces = [
    "Climate Urgency",
    "AI Maturity",
    "Drone Accessibility",
    "Cloud Compute",
    "Biodiversity Regulation",
    "Data Infrastructure",
  ];
  return (
    <section className="lcv2-section" style={{ background: T.darkMid }}>
      <div className="lcv2-container grid grid-cols-1 gap-16 lg:grid-cols-2">
        <Fade dir="left">
          <p className="lcv2-kicker" style={{ color: T.lime }}>
            Why Now
          </p>
          <h2 className="lcv2-title" style={{ color: "#fff" }}>
            The environmental intelligence market is entering its AI era.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.45)",
              lineHeight: 1.75,
              marginTop: 24,
            }}
          >
            Six converging forces have made EcoVision necessary.
          </p>
        </Fade>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {forces.map((force, index) => (
            <Fade key={force} delay={index * 0.07} dir="right">
              <div
                className="lcv2-dark-card rounded-[14px]"
                style={{ padding: "22px 18px" }}
              >
                <h3
                  style={{
                    color: "rgba(255,255,255,.82)",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {force}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,.35)",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  Timing driver from the second script.
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function V2Roadmap() {
  const phases = [
    ["Now", "British saltmarsh ecosystems", T.lime],
    ["2025", "Multi-species ecosystem intelligence", T.leaf],
    ["2026", "Multispectral and LiDAR integration", "#4AB8D4"],
    ["2027", "Continental-scale monitoring", "#F5A623"],
    ["2028-", "Planetary ecological intelligence", "#C06BE8"],
  ];
  return (
    <section
      id="roadmap-v2"
      className="lcv2-section"
      style={{ background: T.cream }}
    >
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker">Roadmap</p>
          <h2 className="lcv2-title" style={{ maxWidth: 740 }}>
            From salt marsh monitoring to planetary ecological intelligence.
          </h2>
        </Fade>
        <div className="mt-16 space-y-2">
          {phases.map(([label, title, color], index) => (
            <Fade key={label} delay={index * 0.12} dir="left">
              <div className="grid grid-cols-[88px_1fr]">
                <div className="flex justify-center pt-5">
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${color}`,
                      background: index === 0 ? color : "transparent",
                      boxShadow: index === 0 ? `0 0 20px ${color}88` : "none",
                    }}
                  />
                </div>
                <div
                  className="lcv2-card"
                  style={{
                    padding: "24px 28px",
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color,
                      letterSpacing: 1,
                    }}
                  >
                    PHASE {index + 1} · {label}
                  </span>
                  <h3
                    style={{
                      fontFamily: T.serif,
                      fontSize: 22,
                      color: T.ink,
                      marginTop: 8,
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: "#777", fontSize: 13.5 }}>
                    Second-script roadmap detail preserved for comparison.
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function V2Team() {
  const people = [
    ["IR", "Ian Rushworth", "Lead Researcher & System Architect"],
    ["PL", "Peter Lawrence", "Species Identification & ShagScope"],
    ["CE", "Claire (ShagScope Lead)", "Seabird Monitoring Lead"],
  ];
  return (
    <section
      id="team-v2"
      className="lcv2-section"
      style={{ background: T.paper }}
    >
      <div className="lcv2-container">
        <Fade>
          <p className="lcv2-kicker">Research Team</p>
          <h2 className="lcv2-title">
            Ecological expertise. Computer vision precision.
          </h2>
        </Fade>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {people.map(([initials, name, role], index) => (
            <Fade key={name} delay={index * 0.1}>
              <div
                className="lcv2-card h-full"
                style={{ padding: "32px 28px" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${T.moss},${T.leaf})`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    marginBottom: 20,
                  }}
                >
                  {initials}
                </div>
                <h3 style={{ fontWeight: 700, color: T.ink }}>{name}</h3>
                <p
                  style={{
                    color: T.leaf,
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {role}
                </p>
                <p style={{ color: "#777", fontSize: 13.5, lineHeight: 1.7 }}>
                  Second-script team content preserved for comparison.
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function FundingCTA() {
  return (
    <section
      id="contact-v2"
      className="lcv2-section"
      style={{ background: T.dark, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage: `linear-gradient(rgba(74,140,28,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,140,28,.08) 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="lcv2-container text-center"
        style={{ maxWidth: 820, position: "relative" }}
      >
        <Fade>
          <p className="lcv2-kicker" style={{ color: T.lime }}>
            The Opportunity
          </p>
          <h2
            className="lcv2-title"
            style={{ color: "#fff", fontSize: "clamp(44px,5.5vw,76px)" }}
          >
            Building the Future of{" "}
            <span style={{ color: T.lime, fontStyle: "italic" }}>
              Ecological Intelligence.
            </span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.45)",
              lineHeight: 1.75,
              maxWidth: 580,
              margin: "24px auto 52px",
            }}
          >
            A second cinematic CTA preserved from the attached script for
            side-by-side comparison.
          </p>
        </Fade>
        <Fade delay={0.15}>
          <div className="flex flex-wrap justify-center gap-3">
            <HoverButton primary>Fund the Research</HoverButton>
            <HoverButton>Become a Research Partner</HoverButton>
            <HoverButton>Request Technical Briefing</HoverButton>
            <HoverButton ghost>Infrastructure Collaboration</HoverButton>
          </div>
        </Fade>
      </div>
    </section>
  );
}
