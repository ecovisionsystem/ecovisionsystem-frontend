import { Layers, BarChart2, Cloud } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-surface" id="features">
      <div className="max-w-max-content mx-auto px-gutter container">
        <div className="text-center mb-16">
          <h2 className="heading-page text-primary mb-4">
            Scientific Precision at Scale
          </h2>
          <p className="font-body-primary text-body-primary text-on-surface-variant max-w-2xl mx-auto">
            Engineered for ecologists, our platform translates complex deep
            learning outputs into actionable, verifiable environmental data.
          </p>
        </div>
        <div className="bento-grid">
          {/* Feature 1: Large Card */}
          <div className="col-span-12 md:col-span-8 bg-surface-raised rounded-xl p-8 border border-border-strong shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-muted rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#14532d] text-brand-muted rounded-lg flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="heading-section text-primary mb-3">
                Species-Level Segmentation
              </h3>
              <p className="font-body-primary text-body-primary text-on-surface-variant mb-6 max-w-md">
                Our two-stage pipeline classifies vegetation down to the species
                level with high accuracy, distinguishing morphologically similar
                halophytic grasses across heterogeneous salt marsh canopies.
              </p>
              <div className="flex flex-col gap-2 mt-4 max-w-sm">
                <div className="flex items-center justify-between text-sm p-2 bg-surface rounded border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-veg-spartina rounded-sm"></div>
                    Spartina maritima
                  </div>
                  <span className="data-mono">IoU: 0.90</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-surface rounded border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-veg-puccinellia rounded-sm"></div>
                    Puccinellia maritima
                  </div>
                  <span className="data-mono">IoU: 0.77</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Vertical Card */}
          <div className="col-span-12 md:col-span-4 bg-surface-raised rounded-xl p-8 border border-border-strong shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
            <div className="w-12 h-12 bg-orange-500/10 text-warning rounded-lg flex items-center justify-center mb-6">
              <BarChart2 size={24} />
            </div>
            <h3 className="heading-section text-heading-section text-primary mb-3">
              Quantified Confidence
            </h3>
            <p className="font-body-primary text-body-primary text-on-surface-variant mb-6">
              ecoVision 2.0 applies conformal prediction via MAPIE to every
              dominance estimate, producing statistically guaranteed coverage
              intervals rather than uncalibrated softmax scores. Researchers
              receive not just a prediction, but a defensible uncertainty bound,
              critical for ecological reporting and regulatory use cases.
            </p>
            <div className="mt-auto bg-surface p-4 rounded border border-border">
              <div className="text-label-xs text-secondary mb-2 uppercase">
                90% Confidence Interval
              </div>
              <div className="w-full h-2 bg-surface-overlay rounded-full relative mb-1">
                <div className="absolute left-[20%] right-[30%] h-full bg-brand-accent rounded-full"></div>
                <div className="absolute left-[45%] w-1 h-3 -mt-0.5 bg-brand-secondary rounded-full"></div>
              </div>
              <div className="flex justify-between data-mono text-[10px] text-muted">
                <span>Lower bound</span>
                <span>Estimate</span>
                <span>Upper bound</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Horizontal Card */}
          <div className="col-span-12 bg-surface-raised rounded-xl p-8 border border-border-strong shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="w-12 h-12 bg-blue-600/10 text-info rounded-lg flex items-center justify-center mb-6">
                <Cloud size={24} />
              </div>
              <h3 className="heading-section text-heading-section text-primary mb-3">
                Cloud-Native Scalability
              </h3>
              <p className="font-body-primary text-body-primary text-on-surface-variant">
                Process gigabyte-scale drone imagery in minutes, not hours.
                Built on AWS infrastructure, the platform dynamically scales GPU
                instances to handle massive parallel inference tasks without
                bottlenecking your research.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-surface p-4 rounded border border-border font-data-mono text-data-mono text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <span className="text-secondary">Scale</span>
                <span className="text-primary">Gigabyte-class</span>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <span className="text-secondary">Processing Time</span>
                <span className="text-primary">Minutes, not hours</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary">Infrastructure</span>
                <span className="text-success font-bold">AWS GPU </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
