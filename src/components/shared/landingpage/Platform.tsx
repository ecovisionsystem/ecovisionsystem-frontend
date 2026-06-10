import { Pill, remoteImages, SectionHeader } from "@/styles/resources";
import { landingComparisonTheme as L, T } from "@/styles/style";
import { useState } from "react";

export default function Platform() {
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
    <section id="platform" className="lc-section" style={{ background: L.bg }}>
      <div className="lc-container">
        <div style={{ marginBottom: 64 }}>
          <SectionHeader
            eyebrow="The Platform"
            title={
              <span style={{ fontFamily: L.serif }}>
                From drone imagery to
                <br />
                <em style={{ color: L.canopy }}>ecological intelligence.</em>
              </span>
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
