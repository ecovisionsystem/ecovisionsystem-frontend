export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low py-12 border-t border-outline-variant">
      <div className="max-w-max-content mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-8 container">
        <div className="col-span-1 md:col-span-2">
          <div className="font-heading-section text-heading-section font-black text-primary mb-4">
            <img
              src="./branding/eco2.png"
              alt="Keele University logo"
              className="h-12 object-contain"
            />
          </div>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            Automated UAV vegetation mapping infrastructure powered by deep
            learning and AWS. Built for the scientific community.
          </p>
          <div className="text-xs text-muted">
            © {year} EcoVision. All rights reserved.
          </div>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Resources</h4>
          <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <li>
              <a className="hover:text-primary transition-colors" href="/docs">
                Documentation
              </a>
            </li>
            <li>
              <a
                className="hover:text-green-600 transition-colors"
                href="/papers"
              >
                Academic Papers
              </a>
            </li>
            <li>
              <a
                className="hover:text-green-600 transition-colors inline-flex items-center gap-2 relative"
                href="/api"
              >
                <span>API Reference</span>
                {/* <span className="rounded-full bg-green-50 text-orange-800 text-[0.45rem] font-semibold uppercase tracking-[0.18em] px-2  absolute -right-[88px] -top-1">
                  coming soon
                </span> */}
              </a>
            </li>
            {/* <li>
              <a
                className="hover:text-green-600 transition-colors"
                href="/models"
              >
                Model Weights
              </a>
            </li> */}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Contact</h4>
          <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <li>
              <a
                className="hover:text-green-600 transition-colors"
                href="mailto:support@ecovision.keele.ac.uk"
              >
                Support
              </a>
            </li>
            <li>
              <a
                className="hover:text-green-600 transition-colors"
                href="/research-collab"
              >
                Research Collaboration
              </a>
            </li>
            <li>
              <a
                className="hover:text-green-600 transition-colors"
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
