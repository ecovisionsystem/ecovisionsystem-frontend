import {
  Image as ImageIcon,
  Network,
  CheckSquare,
  Map as MapIcon,
  ArrowRight,
} from "lucide-react";

export default function Architecture() {
  return (
    <section
      className="py-24 bg-surface-container-lowest border-y border-outline-variant"
      id="architecture"
    >
      <div className="max-w-max-content mx-auto px-gutter container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-surface-raised border border-border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col gap-4 relative">
                {/* Pipeline Visualization */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>

                <div className="flex gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center shrink-0 shadow-sm">
                    <ImageIcon className="text-primary" size={24} />
                  </div>
                  <div className="pt-3">
                    <h4 className="font-medium text-primary mb-1">
                      1. High-Res Ingestion
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      GeoTIFF tiling and normalisation via GDAL.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 border-info flex items-center justify-center shrink-0 shadow-sm">
                    <Network className="text-info" size={24} />
                  </div>
                  <div className="pt-3">
                    <h4 className="font-medium text-primary mb-1">
                      2. Ensemble Inference
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Parallel processing through SegFormer-B2 and ConvNeXt-Base
                      models on AWS g4dn instances.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 border-warning flex items-center justify-center shrink-0 shadow-sm">
                    <CheckSquare className="text-warning" size={24} />
                  </div>
                  <div className="pt-3">
                    <h4 className="font-medium text-primary mb-1">
                      3. Conformal Prediction
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      MAPIE applied for rigorous statistical uncertainty
                      quantification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-surface border-2 border-success flex items-center justify-center shrink-0 shadow-sm">
                    <MapIcon className="text-success" size={24} />
                  </div>
                  <div className="pt-3">
                    <h4 className="font-medium text-primary mb-1">
                      4. Geo-Spatial Assembly
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Results stitched, vectorised, and exported as multi-layer
                      GeoTIFFs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="font-heading-page text-heading-page text-primary mb-6">
              Advanced Model Architecture
            </h2>
            <p className="font-body-primary text-body-primary text-on-surface-variant mb-6">
              EcoVision 2.0 abandons traditional random forest classifiers in
              favor of a sophisticated deep learning ensemble tailored for
              ecological edge cases.
            </p>
            <p className="font-body-primary text-body-primary text-on-surface-variant mb-8">
              Our core pipeline utilizes a fine-tuned{" "}
              <strong>SegFormer-B2</strong> architecture for its robust
              attention mechanisms across varying scales, combined with a{" "}
              <strong>ConvNeXt-Base</strong> feature extractor. This combination
              excels at delineating boundary regions where vegetation classes
              intermix, a common challenge in dynamic salt marsh environments.
            </p>
            <a
              className="text-primary font-medium hover:text-surface-tint flex items-center gap-2 transition-colors"
              href="/papers/architecture"
            >
              Read the Technical Whitepaper
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
