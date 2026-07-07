import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function HeritageSplitSection() {
  return (
    <section
      id="heritage"
      aria-labelledby="heritage-heading"
      className="relative min-h-[72svh] w-full overflow-hidden bg-porcelain sm:min-h-[var(--section-tablet-height)] xl:min-h-[var(--section-desktop-height)]"
    >
      {/* Full-bleed background campaign image */}
      <div className="absolute inset-0 z-0">
        <LuxuryImage
          alt="Gold and emerald jewellery on a warm ivory editorial background"
          asset={homepageImages.heritageMobile}
          className="h-full w-full sm:hidden"
          imageClassName="object-cover object-center"
          sizes="100vw"
        />
        <LuxuryImage
          alt="Gold and emerald jewellery on a warm ivory editorial background"
          asset={homepageImages.heritage}
          className="hidden h-full w-full sm:block"
          fallbackClassName="heritage-fallback"
          imageClassName="object-cover object-[38%_center] xl:object-[42%_center]"
          sizes="100vw"
          fallback={
            <div aria-hidden="true" className="heritage-jewel absolute inset-x-[8%] top-1/2 -translate-y-1/2">
              <span />
              <i />
              <span />
            </div>
          }
        />
      </div>

      {/* Layered overlays: mobile bottom fade and desktop right-side fade */}
      {/* Mobile fade panel */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-[68%] bg-gradient-to-t from-porcelain via-porcelain/82 to-transparent sm:hidden"
      />
      {/* Desktop fade panel */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-10 hidden w-[52%] bg-gradient-to-l from-porcelain/92 via-porcelain/62 to-transparent sm:block lg:w-[50%]"
      />

      {/* Text Container aligned to the right on desktop, bottom-safe on mobile */}
      <div className="relative z-20 flex min-h-[72svh] items-end justify-center px-6 py-16 sm:min-h-[var(--section-tablet-height)] sm:items-center sm:justify-end sm:px-10 sm:py-12 lg:px-16 xl:min-h-[var(--section-desktop-height)] xl:px-24">
        <div className="w-full max-w-[31rem] pb-6 text-center sm:pb-0">
          <p className="mb-5 text-[0.62rem] uppercase tracking-[0.28em] text-charcoal/55">
            Heritage · Earth · Light
          </p>
          <h2
            id="heritage-heading"
            className="font-serif text-[clamp(2rem,3vw,3.25rem)] font-normal leading-[1.12] text-charcoal"
          >
            A Source of Inspiration from Earth and Light
          </h2>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-charcoal/70">
            From golden horizons to the hidden fire of rare stones, each creation
            begins with a search for harmony.
          </p>
          <LuxuryButton className="mt-6" href="/collections/desert-light-collection">
            Travel Through the Story
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
