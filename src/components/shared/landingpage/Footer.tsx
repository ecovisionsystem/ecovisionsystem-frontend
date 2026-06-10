import { SectionHeader } from "@/styles/resources";
import { landingComparisonTheme as L, T } from "@/styles/style";

export default function Footer() {
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
            <span style={{ fontFamily: L.serif, color: L.white }}>
              Building the future of
              <br />
              <em style={{ color: L.lime }}>ecological intelligence.</em>
            </span>
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
