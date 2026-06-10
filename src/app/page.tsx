"use client";

import Header from "@/components/shared/landingpage/Header";
import Hero from "@/components/shared/landingpage/Hero";
import Features from "@/components/shared/landingpage/Features";
import Architecture from "@/components/shared/landingpage/Architecture";
import Partners from "@/components/shared/landingpage/Partners";
import LandingComparisonSections from "@/components/shared/landingpage/comparison/LandingComparisonSections";
import LandingComparisonV2Sections from "@/components/shared/landingpage/comparison-v2/LandingComparisonV2Sections";
import ProblemSection from "@/components/shared/landingpage/ProblemSection";
import Platform from "@/components/shared/landingpage/Platform";
import Science from "@/components/shared/landingpage/Science";
import StatsLandn from "@/components/shared/landingpage/Stats";
import Footer from "@/components/shared/landingpage/Footer";

export default function HomePage() {
  return (
    <>
      <div className="bg-background text-on-background font-body-primary text-body-primary antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ProblemSection />
          <Platform />
          <Science />
          <StatsLandn />
          {/* <Features /> */}
          {/* <Architecture /> */}
          <LandingComparisonSections />
          <Partners />
        </main>
        <Footer />
      </div>
    </>
  );
}
