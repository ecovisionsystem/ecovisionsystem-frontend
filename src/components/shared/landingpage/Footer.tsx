export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low py-12 border-t border-outline-variant">
      <div className="max-w-max-content mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-8 container">
        <div className="col-span-1 md:col-span-2">
          <div className="font-heading-section text-heading-section font-black text-primary mb-4">
            ecoVision
          </div>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            Automated UAV vegetation mapping powered by deep learning and AWS.
            Built for the scientific community.
          </p>
          <div className="text-xs text-muted">
            © {year} EcoVision. All rights reserved.
          </div>
        </div>
        <div>
          <h4 className="font-medium text-primary mb-4">Resources</h4>
          <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <li>
              <a className="hover:text-primary transition-colors" href="/docs">
                Documentation
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="/papers"
              >
                Academic Papers
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/api">
                API Reference
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="/models"
              >
                Model Weights
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-primary mb-4">Contact</h4>
          <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="mailto:support@ecovision.keele.ac.uk"
              >
                Support
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="/research-collab"
              >
                Research Collaboration
              </a>
            </li>
            <li>
              <a
                className="hover:text-primary transition-colors"
                href="/privacy"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
