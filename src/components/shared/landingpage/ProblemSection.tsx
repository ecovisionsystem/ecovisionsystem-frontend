import { remoteImages, SectionHeader, ShellCard } from "@/styles/resources";
import { landingComparisonTheme as L, T } from "@/styles/style";

export default function ProblemSection() {
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
      style={{ background: T.keele, position: "relative", overflow: "hidden" }}
    >
      <div
        className="lc-container"
        style={{ position: "relative", zIndex: 2, color: L.white }}
      >
        <div style={{ marginBottom: 72 }}>
          <SectionHeader
            eyebrow="The Global Problem"
            title={
              <span style={{ fontFamily: L.serif }}>
                Ecological monitoring has not scaled with
                <br />
                <em style={{ color: L.lime }}>environmental collapse.</em>
              </span>
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
