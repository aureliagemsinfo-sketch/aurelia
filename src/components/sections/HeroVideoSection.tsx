"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryLoader } from "@/components/shared/LuxuryLoader";

export function HeroVideoSection() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const showVideoLoader = !isVideoReady;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden bg-[#fbf7ef] text-[#171411]"
    >
      <video
        aria-hidden="true"
        autoPlay
        className={`hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          hasVideoError ? "opacity-0" : "opacity-100"
        }`}
        loop
        muted
        onCanPlay={() => setIsVideoReady(true)}
        onError={() => setHasVideoError(true)}
        onLoadedData={() => setIsVideoReady(true)}
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero-gem-desert.mp4" type="video/mp4" />
      </video>
      {showVideoLoader ? (
        <LuxuryLoader
          className="z-[1] border-0 bg-[linear-gradient(135deg,rgb(255_253_248_/_0.58),rgb(246_236_221_/_0.38),rgb(255_250_241_/_0.44))] backdrop-blur-[1px] transition-opacity duration-500"
          label="Loading hero video"
          variant="video"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#fbf7ef]/45 via-[#fbf7ef]/20 to-transparent"
      />

      <div className="relative z-10 flex min-h-[100svh] items-end px-5 pb-24 sm:px-10 sm:pb-28 md:block">
        <div className="w-full max-w-[28rem] md:absolute md:left-12 lg:left-16 md:top-[45%] md:-translate-y-1/2 md:max-w-[30rem]">
          <p className="mb-5 text-[0.68rem] font-sans uppercase tracking-[0.22em] text-[#171411]/75">
            THE HOUSE OF RARE STONES
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(2.3rem,4vw,4.6rem)] font-normal leading-[1.08] tracking-[-0.015em] text-[#171411]"
          >
            A Story Written in Stone and Light
          </h1>
          <p className="mt-6 text-[clamp(0.95rem,1.1vw,1.05rem)] leading-[1.75] text-[#171411]/82">
            Fine jewellery shaped by colour, proportion, and the quiet brilliance
            of exceptional gemstones.
          </p>
          <div className="mt-8">
            <LuxuryButton className="text-[#171411]" href="/collections">
              Start Exploring
            </LuxuryButton>
          </div>
        </div>
      </div>

      <a
        aria-label="Scroll to craftsmanship story"
        className="scroll-discover absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[0.55rem] uppercase tracking-[0.28em] text-[#171411]/64"
        href="#craftsmanship"
      >
        Discover
        <ChevronDown aria-hidden="true" className="scroll-cue" size={17} strokeWidth={1} />
      </a>
    </section>
  );
}
