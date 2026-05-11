import React from "react";

export default function Partners() {
  return (
    <section
      className="py-16 bg-brand-primary border-b border-outline-variant"
      id="partners"
    >
      <div className="max-w-max-content mx-auto px-gutter text-center">
        <h3 className="text-label-xs font-label-xs text-white uppercase tracking-widest mb-8">
          Developed in Partnership With
        </h3>
        <div className="flex justify-center items-center gap-14 hover:grayscale-0 transition-all duration-300">
          <div>
            <img
              src="./branding/KeeleUni-RGB_MonoWhite.png"
              alt="Keele University logo"
              className="h-16 object-contain"
            />
          </div>
          <div className="w-px h-12 bg-border-strong"></div>
          <div>
            <img
              src="./branding/aws-color.png"
              alt="AWS logo"
              className="h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
