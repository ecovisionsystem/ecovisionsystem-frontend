export default function Partners() {
  return (
    <section
      className="py-16 bg-surface border-b border-outline-variant"
      id="partners"
    >
      <div className="max-w-max-content mx-auto px-gutter text-center">
        <h3 className="text-label-xs font-label-xs text-secondary uppercase tracking-widest mb-8">
          Developed in Partnership With
        </h3>
        <div className="flex justify-center items-center gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="font-heading-section text-2xl font-bold text-primary">
            Keele University
          </div>
          <div className="w-px h-12 bg-border-strong"></div>
          <div className="font-heading-section text-2xl font-black text-on-surface">
            aws
          </div>
        </div>
      </div>
    </section>
  );
}
