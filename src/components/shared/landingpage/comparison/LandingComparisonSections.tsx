"use client";

import React, { useEffect, useState } from "react";
import { landingComparisonTheme as L } from "@/styles/style";
import {
  Counter,
  Pill,
  SectionHeader,
  ShellCard,
  TechBadge,
  useLandingReveal,
} from "./utils";

const remoteImages = {
  field:
    "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&q=80",
  satellite:
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80",
  collapse:
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  drone:
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=700&q=80",
  ai: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&q=80",
  earth:
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700&q=80",
  marsh:
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=700&q=80",
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

export default function LandingComparisonSections() {
  useLandingReveal();

  return (
    <div className="landing-comparison">
      {/* <MetricsStrip /> */}
      {/* <ProblemSection /> */}
      {/* <SolutionSection /> */}
      {/* <ScienceSection /> */}
      <ComparisonArchitecture />
      {/* <LiveVisualization /> */}
      {/* <ImpactSection /> */}
      {/* <WhyNowSection /> */}
      <RoadmapSection />
      {/* <ComparisonPartners /> */}
      {/* <TeamSection /> */}
      {/* <FinalComparisonCTA /> */}
    </div>
  );
}

function MetricsStrip() {
  const metrics = [
    { value: 96.2, suffix: "%", decimals: 1, label: "Pixel-level Accuracy" },
    { value: 99, suffix: "%", decimals: 1, label: "Species Classification" },
    { value: 2, suffix: "cm", decimals: 0, label: "Ground Sampling Distance" },
    { value: 8, suffix: "x", decimals: 0, label: "Faster than Field Survey" },
    { value: 94, suffix: "%", decimals: 0, label: "Mean IoU" },
  ];

  return (
    <section style={{ background: L.forest }}>
      <div className="lc-container" style={{ padding: "56px 72px" }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-0">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`lc-reveal lc-s${index + 1} text-center`}
              style={{
                padding: "16px 8px",
                borderRight:
                  index < metrics.length - 1
                    ? "1px solid rgba(255,255,255,.1)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: L.serif,
                  fontSize: "clamp(36px,4vw,54px)",
                  color: L.lime,
                  letterSpacing: -2,
                  lineHeight: 1,
                }}
              >
                <Counter
                  to={metric.value}
                  suffix={metric.suffix}
                  decimals={metric.decimals}
                />
              </div>
              <div
                style={{
                  fontFamily: L.sans,
                  fontSize: 12,
                  color: "rgba(255,255,255,.5)",
                  marginTop: 8,
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      n: "01",
      title: "Manual Surveys Can't Scale",
      image: remoteImages.field,
      items: [
        "Labour-intensive and expensive",
        "Inconsistent methodology",
        "Spatially limited coverage",
        "Months to deliver results",
      ],
    },
    {
      n: "02",
      title: "Satellites Lack Precision",
      image: remoteImages.satellite,
      items: [
        "10-30m resolution misses species",
        "No temporal flexibility",
        "No ecological granularity",
        "Cloud interference limits coverage",
      ],
    },
    {
      n: "03",
      title: "Ecosystems Are Collapsing Faster",
      image: remoteImages.collapse,
      items: [
        "30% global wetland loss since 1970",
        "Pioneer zones shift in weeks",
        "Monitoring lags biodiversity collapse",
        "Decision-makers lack real-time data",
      ],
    },
  ];

  return (
    <section
      id="problem"
      className="lc-section lc-grain"
      style={{ background: L.ink, position: "relative", overflow: "hidden" }}
    >
      <div className="lc-container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 72 }}>
          <SectionHeader
            eyebrow="The Global Problem"
            dark
            title={
              <>
                Ecological monitoring has not scaled with
                <br />
                <em style={{ color: L.lime }}>environmental collapse.</em>
              </>
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <ShellCard
              key={problem.title}
              dark
              className={`lc-reveal lc-card-hover lc-s${index + 1}`}
            >
              <div
                style={{
                  height: 200,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={problem.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(.4) brightness(.5)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(14,20,9,.9),transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 16,
                    fontFamily: L.serif,
                    color: "rgba(255,255,255,.4)",
                  }}
                >
                  {problem.n}
                </div>
              </div>
              <div style={{ padding: "28px 28px 32px" }}>
                <h3
                  style={{
                    fontFamily: L.serif,
                    fontSize: 22,
                    color: L.white,
                    marginBottom: 18,
                  }}
                >
                  {problem.title}
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {problem.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        color: "rgba(255,255,255,.55)",
                        marginBottom: 9,
                        paddingLeft: 16,
                        position: "relative",
                        lineHeight: 1.5,
                        fontSize: 13.5,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "rgba(125,209,58,.6)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ShellCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const [active, setActive] = useState(0);
  const steps = [
    {
      n: "01",
      title: "UAV Acquisition",
      sub: "DJI Phantom 4 Pro · 30m AGL · 2cm GSD",
      image: remoteImages.drone,
      desc: "Systematic grid flights over intertidal survey zones. 80% overlap enables photogrammetric reconstruction and raw RGB orthomosaics at 2.1cm/px.",
      specs: [
        ["Altitude", "30m AGL"],
        ["Resolution", "2.1 cm/px"],
        ["Overlap", "80% fwd / 75% side"],
        ["Format", "GeoTIFF ortho"],
      ],
    },
    {
      n: "02",
      title: "AI Segmentation",
      sub: "SegFormer-B5 · Mix Transformer encoder",
      image: remoteImages.ai,
      desc: "Hierarchical transformer features across 512x512 tiles produce pixel-level vegetation masks with class probabilities.",
      specs: [
        ["Architecture", "SegFormer-B5"],
        ["Tile size", "512x512 px"],
        ["Classes", "4 vegetation classes"],
        ["mIoU", "94.1%"],
      ],
    },
    {
      n: "03",
      title: "Species Classification",
      sub: "ConvNeXt-Base · patch-level inference",
      image: remoteImages.earth,
      desc: "Segmented vegetation blobs are processed by ConvNeXt-Base to resolve species identity at ecotone boundaries.",
      specs: [
        ["Architecture", "ConvNeXt-Base"],
        ["Input", "Blob patches"],
        ["Accuracy", "97.3%"],
        ["Classes", "S. maritima · P. maritima"],
      ],
    },
    {
      n: "04",
      title: "Dominance Scoring",
      sub: "Novel ecological metric · field-validated",
      image: remoteImages.marsh,
      desc: "A dominance index quantifies inter-species competitive dominance per 2x2m grid cell and exports GIS-ready outputs.",
      specs: [
        ["Resolution", "2x2 m grid"],
        ["Validation", "MAE 0.078"],
        ["Output", "GeoJSON · CSV · raster"],
        ["Coverage", "Per hectare in <4 min"],
      ],
    },
  ];
  const step = steps[active];

  return (
    <section id="solution" className="lc-section" style={{ background: L.bg }}>
      <div className="lc-container">
        <div style={{ marginBottom: 64 }}>
          <SectionHeader
            eyebrow="The Platform"
            title={
              <>
                From drone imagery to
                <br />
                <em style={{ color: L.canopy }}>ecological intelligence.</em>
              </>
            }
            subtitle="A four-stage AI pipeline built for distinct ecological perception tasks."
          />
        </div>
        <div className="mb-9 flex flex-wrap gap-2">
          {steps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(index)}
              className="lc-tab"
              style={{
                background: active === index ? L.forest : L.bg2,
                color: active === index ? L.white : L.ink2,
              }}
            >
              {item.n} {item.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div
            className="lc-reveal-left"
            style={{
              borderRadius: 20,
              overflow: "hidden",
              minHeight: 380,
              position: "relative",
            }}
          >
            <img
              key={step.image}
              src={step.image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
                animation: "lcFadeUp .5s ease both",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg,transparent 40%,rgba(14,20,9,.75))",
              }}
            />
            <div
              style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}
            >
              <Pill dark>{step.n}</Pill>
              <h3
                style={{
                  fontFamily: L.serif,
                  color: L.white,
                  fontSize: 30,
                  marginTop: 10,
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>
                {step.sub}
              </p>
            </div>
          </div>
          <div
            className="lc-reveal-right"
            style={{
              background: L.white,
              borderRadius: 20,
              padding: 40,
              border: `1px solid ${L.bg3}`,
              boxShadow: L.shadow,
            }}
          >
            <p style={{ color: L.ink2, lineHeight: 1.8, marginBottom: 32 }}>
              {step.desc}
            </p>
            <div style={{ borderTop: `1px solid ${L.bg2}`, paddingTop: 28 }}>
              <p className="lc-eyebrow" style={{ color: L.ink3 }}>
                Specifications
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {step.specs.map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      background: L.bg,
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: L.ink3,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {key}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: L.forest,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScienceSection() {
  const contributions = [
    "Transformer Vegetation Segmentation",
    "UAV Species Intelligence",
    "Dominance Mapping Framework",
    "Ecological AI Infrastructure",
    "Spatial Aggregation Systems",
    "MAPIE Conformal Prediction",
  ];

  return (
    <section id="science" className="lc-section" style={{ background: L.bg2 }}>
      <div className="lc-container grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Research Foundation"
            title={
              <>
                Built on peer-reviewed
                <br />
                <em style={{ color: L.canopy }}>ecological and AI research.</em>
              </>
            }
            subtitle="EcoVision 2.0 is grounded in reproducible science, GIS workflows, and model validation."
          />
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              ["96.2%", "Pixel accuracy"],
              ["99.0%", "Species classification"],
              ["0.941", "Mean IoU"],
              ["<8%", "Dominance MAE"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`lc-reveal lc-s${index + 1}`}
                style={{
                  background: L.white,
                  borderRadius: 14,
                  padding: "20px 22px",
                  border: `1px solid ${L.bg3}`,
                }}
              >
                <div
                  style={{ fontFamily: L.serif, fontSize: 36, color: L.forest }}
                >
                  {value}
                </div>
                <div style={{ color: L.ink3, fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contributions.map((title, index) => (
            <div
              key={title}
              className={`lc-reveal lc-card-hover lc-s${(index % 6) + 1}`}
              style={{
                background: L.white,
                borderRadius: 14,
                padding: 22,
                border: `1px solid ${L.bg3}`,
              }}
            >
              <div style={{ color: L.canopy, marginBottom: 12 }}>⬡</div>
              <h3 style={{ fontWeight: 700, color: L.ink, marginBottom: 8 }}>
                {title}
              </h3>
              <p style={{ fontSize: 12.5, color: L.ink3, lineHeight: 1.6 }}>
                Comparison content from the research script, preserved for later
                editorial selection.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonArchitecture() {
  const layers = [
    [
      "Frontend Intelligence",
      [
        "Next.js · React",
        "Cognito SSO",
        "Presigned S3 Uploads",
        "CloudFront CDN",
      ],
    ],
    [
      "AI Inference Layer",
      ["SegFormer-B5", "ConvNeXt-Base", "MAPIE Conformal", "PyTorch · CUDA"],
    ],
    [
      "Cloud Infrastructure",
      ["AWS ECS · Lambda", "SQS · S3 buckets", "EC2 GPU", "CloudWatch"],
    ],
    [
      "Research Compute",
      ["Keele HPC · SLURM", "MLflow · DVC", "VPN", "TensorBoard"],
    ],
  ];

  return (
    <section
      id="architecture-comparison"
      className="lc-section"
      style={{ background: L.bg }}
    >
      <div className="lc-container">
        <SectionHeader
          eyebrow="Technology Stack"
          title={
            <>
              Institutional-grade
              <br />
              <em style={{ color: L.canopy }}>AI infrastructure.</em>
            </>
          }
          subtitle="Four architectural layers from edge delivery to research HPC."
        />
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {layers.map(([label, items], index) => (
            <div
              key={label as string}
              className={`lc-reveal lc-card-hover lc-s${index + 1}`}
              style={{
                background: ["#E8F0E2", "#DDF0D8", "#D8EDD5", "#E2EEE0"][index],
                borderRadius: 20,
                padding: "28px 24px",
                border: "1px solid rgba(47,107,20,.2)",
              }}
            >
              <p className="lc-eyebrow">{label}</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {(items as string[]).map((item) => (
                  <li
                    key={item}
                    style={{
                      color: L.ink2,
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(14,20,9,.07)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveVisualization() {
  const [mode, setMode] = useState("segment");
  const patches = [
    {
      x: 5,
      y: 8,
      w: 30,
      h: 30,
      sp: "S. maritima",
      conf: 97.1,
      dom: 0.74,
      ca: "78,158,31",
    },
    {
      x: 38,
      y: 5,
      w: 25,
      h: 35,
      sp: "P. maritima",
      conf: 94.5,
      dom: 0.52,
      ca: "47,107,20",
    },
    {
      x: 66,
      y: 12,
      w: 28,
      h: 26,
      sp: "S. maritima",
      conf: 95.9,
      dom: 0.68,
      ca: "78,158,31",
    },
    {
      x: 8,
      y: 46,
      w: 22,
      h: 28,
      sp: "Mixed",
      conf: 88.4,
      dom: 0.31,
      ca: "125,209,58",
    },
    {
      x: 36,
      y: 50,
      w: 27,
      h: 30,
      sp: "P. maritima",
      conf: 93.8,
      dom: 0.55,
      ca: "47,107,20",
    },
    {
      x: 70,
      y: 48,
      w: 22,
      h: 24,
      sp: "S. maritima",
      conf: 96.2,
      dom: 0.71,
      ca: "78,158,31",
    },
  ];

  return (
    <section
      className="lc-section lc-grain"
      style={{ background: L.ink, overflow: "hidden" }}
    >
      <div className="lc-container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 52 }}>
          <SectionHeader
            eyebrow="Live AI Visualisation"
            dark
            title={
              <>
                Watch the intelligence
                <br />
                <em style={{ color: L.lime }}>work in real time.</em>
              </>
            }
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["segment", "Segmentation"],
            ["heatmap", "Dominance Heatmap"],
            ["compare", "Before / After"],
            ["temporal", "Temporal Change"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className="lc-tab"
              style={{
                background: mode === key ? L.lime : "rgba(255,255,255,.07)",
                color: mode === key ? L.ink : "rgba(255,255,255,.5)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
            background: "#0a1103",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              background: "#060d02",
              display: "flex",
              gap: 10,
            }}
          >
            {["#FF5F57", "#FFBD2E", "#28C940"].map((color) => (
              <span
                key={color}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: color,
                }}
              />
            ))}
            <span
              style={{
                marginLeft: "auto",
                color: L.lime,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              LIVE INFERENCE
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 460,
              overflow: "hidden",
              background:
                mode === "compare"
                  ? "linear-gradient(90deg,#0a1a04 0%,#0a1a04 50%,#1a3008 50%,#1a3008 100%)"
                  : "linear-gradient(155deg,#0f1c05,#091202 50%,#101e04)",
            }}
          >
            {patches.map((patch, index) => {
              if (mode === "compare" && patch.x <= 45) return null;
              const alpha = mode === "heatmap" ? 0.25 + patch.dom * 0.6 : 0.48;
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${patch.x}%`,
                    top: `${patch.y}%`,
                    width: `${patch.w}%`,
                    height: `${patch.h}%`,
                    background: `rgba(${patch.ca},${alpha})`,
                    border: `1.5px solid rgba(${patch.ca},.75)`,
                    borderRadius: 6,
                    animation: "lcFadeUp .5s ease both",
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      background: "rgba(0,0,0,.7)",
                      borderRadius: 4,
                      padding: "2px 7px",
                      color: "rgba(255,255,255,.85)",
                      fontSize: 9,
                    }}
                  >
                    <em>{patch.sp}</em>{" "}
                    <strong style={{ color: L.lime }}>
                      {mode === "heatmap" ? `D:${patch.dom}` : `${patch.conf}%`}
                    </strong>
                  </div>
                </div>
              );
            })}
            {mode === "segment" && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg,transparent,rgba(125,209,58,.9),transparent)",
                  animation: "lcScanDown 3s ease-in-out infinite",
                }}
              />
            )}
            {mode === "heatmap" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 50% at 25% 35%,rgba(78,158,31,.12),transparent 60%)",
                  animation: "lcHeatFlick 3s ease infinite",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  const apps = [
    [
      "Coastal Monitoring",
      "Automated intertidal surveys at sub-weekly cadence.",
      remoteImages.coast,
    ],
    [
      "Biodiversity Intelligence",
      "Species composition and dominance indices for reporting.",
      remoteImages.biodiversity,
    ],
    [
      "Wetland Conservation",
      "Track restoration outcomes across managed sites.",
      remoteImages.wetland,
    ],
    [
      "Climate Adaptation",
      "Blue carbon baseline mapping and condition data.",
      remoteImages.climate,
    ],
    [
      "Invasive Species Detection",
      "Early detection before stand establishment.",
      remoteImages.invasive,
    ],
    [
      "Regulatory Compliance",
      "Exportable species maps for site reporting.",
      remoteImages.compliance,
    ],
  ];

  return (
    <section className="lc-section" style={{ background: L.bg2 }}>
      <div className="lc-container">
        <SectionHeader
          eyebrow="Impact & Applications"
          centered
          title={
            <>
              Built for governments, researchers,
              <br />
              <em style={{ color: L.canopy }}>and climate infrastructure.</em>
            </>
          }
        />
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apps.map(([title, body, image], index) => (
            <ShellCard
              key={title}
              className={`lc-reveal lc-card-hover lc-s${(index % 3) + 1}`}
            >
              <img
                src={image}
                alt=""
                style={{
                  width: "100%",
                  height: 170,
                  objectFit: "cover",
                  filter: "saturate(.75)",
                }}
              />
              <div style={{ padding: "22px 24px" }}>
                <h3 style={{ fontWeight: 700, color: L.ink, marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: L.ink3, lineHeight: 1.7 }}>
                  {body}
                </p>
              </div>
            </ShellCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNowSection() {
  const forces = [
    ["Climate Urgency", "30%", "global wetland loss since 1970"],
    ["AI Maturity", "94%", "mIoU now exceeds survey fidelity"],
    ["Drone Accessibility", "2cm", "GSD at low operational cost"],
    ["Cloud Compute", "<4 min", "per-hectare GPU inference"],
  ];

  return (
    <section className="lc-section" style={{ background: L.bg }}>
      <div className="lc-container grid grid-cols-1 gap-16 lg:grid-cols-2">
        <SectionHeader
          eyebrow="Why Now"
          title={
            <>
              The environmental intelligence market is entering its
              <br />
              <em style={{ color: L.canopy }}>AI era.</em>
            </>
          }
          subtitle="Climate urgency, AI maturity, drone access, and biodiversity reporting have converged."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {forces.map(([label, value, desc], index) => (
            <div
              key={label}
              className={`lc-reveal lc-card-hover lc-s${index + 1}`}
              style={{
                background: L.white,
                borderRadius: 18,
                padding: 28,
                border: `1px solid ${L.bg3}`,
                boxShadow: L.shadow,
              }}
            >
              <p className="lc-eyebrow" style={{ color: L.ink3 }}>
                {label}
              </p>
              <div
                style={{
                  fontFamily: L.serif,
                  fontSize: 38,
                  color: L.forest,
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: L.ink3,
                  lineHeight: 1.6,
                  marginTop: 8,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const [active, setActive] = useState(0);
  const phases = [
    {
      phase: "Phase 1",
      title: "British Saltmarsh",
      timeline: "2024-25",
      status: "active",
      items: [
        "Spartina maritima mapping",
        "Foryd Bay validation",
        "Dominance scoring v1",
      ],
    },
    {
      phase: "Phase 2",
      title: "Multi-Species Intelligence",
      timeline: "2025-26",
      status: "next",
      items: [
        "12+ vegetation classes",
        "National site network",
        "API v1 launch",
      ],
    },
    {
      phase: "Phase 3",
      title: "Sensor Fusion",
      timeline: "2026",
      status: "future",
      items: [
        "Multispectral integration",
        "LiDAR canopy height",
        "3D analysis",
      ],
    },
    {
      phase: "Phase 4",
      title: "Continental Scale",
      timeline: "2027",
      status: "future",
      items: [
        "EU saltmarsh network",
        "Multi-country deployment",
        "Real-time alerting",
      ],
    },
    {
      phase: "Phase 5",
      title: "Planetary Intelligence",
      timeline: "2028+",
      status: "future",
      items: [
        "Satellite-UAV fusion",
        "Global wetland OS",
        "Carbon registry integration",
      ],
    },
  ];
  const phase = phases[active];

  return (
    <section id="roadmap" className="lc-section" style={{ background: L.bg2 }}>
      <div className="lc-container">
        <SectionHeader
          eyebrow="Roadmap"
          title={
            <>
              From saltmarsh monitoring to
              <br />
              <em style={{ color: L.canopy }}>ecological intelligence.</em>
            </>
          }
        />
        <div className="mt-16 flex gap-3 overflow-x-auto pb-3">
          {phases.map((item, index) => (
            <button
              key={item.phase}
              type="button"
              onClick={() => setActive(index)}
              className="lc-tab shrink-0"
              style={{
                background: active === index ? L.forest : L.bg,
                color: active === index ? L.white : L.ink3,
                boxShadow:
                  item.status === "active"
                    ? "0 0 0 8px rgba(47,107,20,.12)"
                    : undefined,
              }}
            >
              {item.phase} · {item.timeline}
            </button>
          ))}
        </div>
        <div
          className="mt-8 grid grid-cols-1 gap-8 rounded-[20px] border bg-white p-9 lg:grid-cols-[1fr_2fr]"
          style={{ borderColor: L.bg3, boxShadow: L.shadow }}
        >
          <div>
            <Pill>
              {phase.status === "active"
                ? "Active"
                : phase.status === "next"
                  ? "Next"
                  : "Future"}
            </Pill>
            <h3
              style={{
                fontFamily: L.serif,
                fontSize: 32,
                color: L.ink,
                marginTop: 14,
              }}
            >
              {phase.title}
            </h3>
            <p style={{ color: L.ink3, fontWeight: 700 }}>{phase.timeline}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {phase.items.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "11px 16px",
                  background: L.bg,
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: L.leaf,
                  }}
                />
                <span style={{ color: L.ink2, fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonPartners() {
  const orgs = [
    ["Keele University", "Research Institution", "academic"],
    ["Amazon Web Services", "Cloud Infrastructure", "tech"],
    ["NVIDIA", "GPU Compute", "tech"],
    ["PyTorch / Meta AI", "Deep Learning Framework", "tech"],
    ["HuggingFace", "Model Hub & Transformers", "tech"],
    ["Keele HPC", "Research Compute", "compute"],
  ];

  return (
    <section className="lc-section" style={{ background: L.bg }}>
      <div className="lc-container">
        <SectionHeader
          eyebrow="Partners & Collaboration"
          centered
          title="Research & infrastructure collaboration."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map(([name, role, type], index) => (
            <div
              key={name}
              className={`lc-reveal lc-card-hover lc-s${(index % 3) + 1}`}
              style={{
                background: L.white,
                borderRadius: 16,
                padding: "24px 28px",
                border: `1px solid ${L.bg3}`,
                boxShadow: L.shadow,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background:
                    type === "academic"
                      ? "rgba(26,58,10,.08)"
                      : "rgba(78,158,31,.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {type === "academic" ? "A" : type === "compute" ? "HPC" : "AI"}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: L.ink }}>{name}</h3>
                <p style={{ fontSize: 12, color: L.ink3 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section id="team" className="lc-section" style={{ background: L.bg2 }}>
      <div className="lc-container">
        <SectionHeader
          eyebrow="Research Team"
          title={
            <>
              Ecological expertise meets
              <br />
              <em style={{ color: L.canopy }}>computer vision precision.</em>
            </>
          }
        />
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div
            className="lc-reveal-left lc-card-hover"
            style={{
              background: L.white,
              borderRadius: 24,
              padding: 44,
              border: `1px solid ${L.bg3}`,
              boxShadow: L.shadow2,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${L.forest},${L.leaf})`,
                color: L.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: L.serif,
                fontSize: 26,
                marginBottom: 22,
              }}
            >
              I
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: L.ink }}>
              Ian Rushworth
            </h3>
            <p style={{ color: L.leaf, fontSize: 12, fontWeight: 700 }}>
              Lead Researcher & System Architect
            </p>
            <p
              style={{
                color: L.ink3,
                fontSize: 14,
                lineHeight: 1.75,
                marginTop: 20,
              }}
            >
              Designed the end-to-end EcoVision pipeline across UAV survey
              protocol, SegFormer-B5, ConvNeXt-Base, dominance scoring, and
              AWS-native infrastructure.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "UAV Survey Design",
                "Deep Learning",
                "Cloud Architecture",
                "Ecological AI",
                "Remote Sensing",
              ].map((tag) => (
                <TechBadge key={tag}>{tag}</TechBadge>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[
              ["CP", "Claire & Peter", "ShagScope — Seabird Monitoring"],
              [
                "KU",
                "Keele University",
                "Research Institution & Supervisory Team",
              ],
            ].map(([initials, name, role], index) => (
              <div
                key={name}
                className={`lc-reveal-right lc-card-hover lc-s${index + 1}`}
                style={{
                  background: L.white,
                  borderRadius: 20,
                  padding: 28,
                  border: `1px solid ${L.bg3}`,
                  boxShadow: L.shadow,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${L.canopy},${L.lime})`,
                      color: L.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: L.serif,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: L.ink }}>{name}</h3>
                    <p style={{ fontSize: 11, color: L.leaf, fontWeight: 700 }}>
                      {role}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: L.ink3, lineHeight: 1.7 }}>
                  Preserved comparison-team content from the attached script for
                  later refinement.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalComparisonCTA() {
  return (
    <section
      id="cta"
      className="lc-section lc-grain"
      style={{ background: L.ink, textAlign: "center", overflow: "hidden" }}
    >
      <div
        className="lc-container"
        style={{ position: "relative", zIndex: 2, maxWidth: 760 }}
      >
        <SectionHeader
          eyebrow="Get Involved"
          centered
          dark
          title={
            <>
              Building the future of
              <br />
              <em style={{ color: L.lime }}>ecological intelligence.</em>
            </>
          }
          subtitle="A new category of environmental infrastructure where AI, ecology, and scalable cloud systems converge."
        />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            "Fund the Research",
            "Become a Research Partner",
            "Request Technical Briefing",
          ].map((label, index) => (
            <button
              key={label}
              type="button"
              className="lc-tab"
              style={{
                background: index === 0 ? L.lime : "transparent",
                color: index === 0 ? L.ink : "rgba(255,255,255,.7)",
                border:
                  index === 0 ? "none" : "1.5px solid rgba(255,255,255,.15)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
