import { T } from "@/styles/style";
import React, { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Platform", "Science", "Architecture", "Impact", "Roadmap"];
  return (
    <nav
      style={{
        position: "fixed",
        inset: "0 0 auto",
        zIndex: 200,
        padding: scrolled ? "12px 56px" : "20px 56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(247,245,240,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
        transition: "all 0.45s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <div className="container mx-auto w-full flex items-center justify-between px-[76px]">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={30} />
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily: T.sans,
                fontSize: 13.5,
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
                letterSpacing: "0.1px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = T.moss)
              }
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = "#555")
              }
            >
              {l}
            </a>
          ))}
          <a
            href="/login"
            style={{
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: T.moss,
              padding: "9px 22px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              boxShadow: `0 2px 16px ${T.moss}44`,
              transition: "all 0.25s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = T.leaf;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = T.moss;
              e.currentTarget.style.transform = "none";
            }}
          >
            Run Inference
          </a>
        </div>
      </div>
    </nav>
  );
}

function LogoMark({ size = 28 }) {
  return (
    <>
      <a
        className="text-on-surface-variant hover:text-primary transition-all font-body-primary text-body-primary"
        href="#features"
      >
        <img
          src="./branding/eco2.png"
          alt="Keele University logo"
          className="h-10 object-contain"
        />
      </a>
    </>
  );
}
