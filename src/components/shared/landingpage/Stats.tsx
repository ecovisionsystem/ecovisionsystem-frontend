import { useInView } from "@/lib/utils/helpers";
import { landingComparisonTheme as L, T } from "@/styles/style";

export default function StatsLandn() {
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
        background: T.keele,
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
