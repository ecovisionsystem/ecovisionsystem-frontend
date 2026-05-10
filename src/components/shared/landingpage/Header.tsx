export default function Header() {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-gutter py-3 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto w-full flex items-center justify-between">
        <a
          className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
          href="#features"
        >
          <div className="font-heading-section text-heading-section font-black text-primary">
            ecoVision
          </div>
        </a>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 ml-8">
            <a
              className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
              href="#architecture"
            >
              Architecture
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
              href="#partners"
            >
              Partners
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="text-primary font-medium hover:text-surface-tint transition-colors"
            href="/auth/login"
          >
            Sign In
          </a>
          <a
            className="bg-brand-primary text-white text-on-primary px-6 py-2 rounded-lg font-medium hover:bg-surface-tint transition-colors shadow-sm"
            href="/dashboard"
          >
            Dashboard
          </a>
        </div>
      </div>
    </header>
  );
}
