import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function DarkCampaignSection() {
  return (
    <section
      id="campaign"
      aria-labelledby="campaign-heading"
      className="relative flex flex-col overflow-hidden bg-dark-teal text-white sm:min-h-[var(--section-tablet-height)] sm:flex-row sm:items-center sm:justify-end xl:min-h-[var(--section-desktop-height)]"
    >
      {/* Visual Container */}
      <div className="relative z-0 h-[46svh] w-full sm:absolute sm:inset-0 sm:h-full">
        <LuxuryImage
          alt="Gold gemstone flower floating on deep teal water"
          asset={homepageImages.gemstoneWater}
          className="w-full h-full"
          fallbackClassName="campaign-water"
          imageClassName="object-cover object-[45%_center] brightness-[1.11] contrast-[0.99] saturate-[1.04] sm:object-[38%_center] xl:object-[32%_center]"
          sizes="100vw"
          fallback={
            <>
              <div aria-hidden="true" className="lily-pad lily-pad-one" />
              <div aria-hidden="true" className="lily-pad lily-pad-two" />
              <div aria-hidden="true" className="gem-flower">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span key={index} />
                ))}
                <i />
              </div>
            </>
          }
        />
        {/* Mobile bottom fade to smooth the card transition */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark-teal to-transparent sm:hidden" />
      </div>

      {/* Desktop layered gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-r from-transparent via-dark-teal/18 to-dark-teal/78 sm:block"
      />

      {/* Text Container */}
      <div className="relative z-20 w-full bg-dark-teal px-6 pb-20 pt-10 text-center sm:mr-[4vw] sm:w-[46%] sm:bg-transparent sm:px-8 sm:py-16 sm:text-left lg:mr-[6vw] lg:w-[42%] lg:px-12 xl:py-24">
        <div className="mx-auto max-w-[34rem] sm:mx-0">
          <p className="mb-5 text-[0.62rem] uppercase tracking-[0.3em] text-champagne/80">
            Botanical Forms · No. 01
          </p>
          <h2
            id="campaign-heading"
            className="font-serif text-[clamp(2rem,3vw,3.25rem)] font-normal leading-[1.12]"
          >
            Gold and Gemstone Forms Come to Life
          </h2>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-white/72">
            A luminous collection where polished gold, diamonds, and vivid stones
            move with the softness of nature.
          </p>
          <LuxuryButton className="mt-6" href="/collections/emerald-garden-collection" inverse>
            Discover the Precious Forms
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
