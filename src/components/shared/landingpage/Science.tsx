import { SectionHeader } from "@/styles/resources";
import { landingComparisonTheme as L, T } from "@/styles/style";

export default function Science() {
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
              <span style={{ fontFamily: L.serif }}>
                Built on peer-reviewed
                <br />
                <em style={{ color: L.canopy }}>ecological and AI research.</em>
              </span>
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
