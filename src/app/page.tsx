"use client";

import Header from "@/components/shared/landingpage/Header";
import Hero from "@/components/shared/landingpage/Hero";
import Features from "@/components/shared/landingpage/Features";
import Architecture from "@/components/shared/landingpage/Architecture";
import Partners from "@/components/shared/landingpage/Partners";
import Footer from "@/components/shared/landingpage/Footer";

export default function HomePage() {
  return (
    <div className="bg-background text-on-background font-body-primary text-body-primary antialiased min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Architecture />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}
