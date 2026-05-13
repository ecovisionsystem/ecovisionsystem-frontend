import { FlaskConical, ArrowRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden hero-gradient border-b border-outline-variant">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMxNDUzMmQiLz48L3N2Zz4=')]"></div>
      <div className="max-w-max-content mx-auto px-gutter relative z-10 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-green-800 bg-green-50 text-primary-container text-label-xs font-label-xs mb-6 ">
              <FlaskConical size={14} />
              <span>Version 2.0 Now Live</span>
            </div>
            <h1 className="font-display text-display text-primary mb-6 tracking-tight lg:text-[48px] lg:leading-[1.1]">
              Species-Level Salt Marsh Intelligence
            </h1>
            <p className="font-body-primary text-body-primary text-on-surface-variant mb-8 max-w-xl text-lg">
              Automated UAV vegetation mapping powered by deep learning and AWS.
              Designed for ecologists requiring high-fidelity geographic and
              statistical precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                className="bg-brand-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-surface-tint transition-colors shadow-sm flex items-center justify-center gap-2"
                href="#features"
              >
                Explore the Platform
                <ArrowRight size={20} />
              </a>
              <a
                className="border border-outline-variant bg-surface text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-overlay transition-colors flex items-center justify-center gap-2"
                href="/docs"
              >
                Read Documentation
                <FileText size={20} />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-primary/5 rounded-xl blur-xl"></div>
            <div className="glass-panel rounded-xl p-4 shadow-xl relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-dim relative border border-outline-variant">
                <div
                  className="absolute inset-0 bg-surface-dim flex items-center justify-center"
                  aria-label="A highly detailed, top-down drone satellite imagery map of a coastal salt marsh..."
                >
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-class-spartina opacity-40 blur-md rounded-full mix-blend-multiply"></div>
                    <div className="absolute top-1/2 right-1/4 w-1/3 h-1/3 bg-class-puccinellia opacity-40 blur-md rounded-full mix-blend-multiply"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1/4 h-1/4 bg-class-water opacity-50 blur-sm mix-blend-multiply"></div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-surface rounded-lg shadow-md border border-border p-3 flex flex-col gap-2 w-48 z-20">
                  <div className="text-label-xs font-label-xs text-secondary uppercase tracking-wide mb-1">
                    Dominance
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-veg-spartina"></div>
                      <span className="text-on-surface font-medium">
                        Spartina
                      </span>
                    </div>
                    <span className="data-mono text-data-mono text-primary">
                      62%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-veg-puccinellia"></div>
                      <span className="text-on-surface font-medium">
                        Puccinellia
                      </span>
                    </div>
                    <span className="data-mono text-data-mono text-primary">
                      28%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
