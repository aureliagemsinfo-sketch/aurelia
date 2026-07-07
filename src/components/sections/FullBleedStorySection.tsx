import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function FullBleedStorySection() {
  return (
    <section
      id="craftsmanship"
      aria-labelledby="craftsmanship-heading"
      className="relative flex min-h-[68svh] items-end overflow-hidden px-6 py-16 text-white sm:min-h-[var(--section-tablet-height)] sm:items-center sm:px-10 sm:py-12 lg:px-16 xl:min-h-[var(--section-desktop-height)] xl:py-16"
    >
      <LuxuryImage
        alt="Ruby and diamond brooch resting on an artisan workbench"
        asset={homepageImages.craftsmanship}
        className="absolute inset-0"
        fallbackClassName="craftsmanship-scene"
        imageClassName="object-[72%_center] sm:object-[62%_center]"
        sizes="100vw"
        fallback={
          <>
            <div aria-hidden="true" className="workbench-lines absolute inset-0" />
            <div aria-hidden="true" className="ruby-brooch">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} />
              ))}
              <i />
            </div>
          </>
        }
      />
      <div aria-hidden="true" className="craftsmanship-overlay absolute inset-0" />

      <div className="relative z-10 max-w-[28rem]">
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-white/70">
          Savoir-Faire · The Atelier
        </p>
        <h2
          id="craftsmanship-heading"
          className="font-serif text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[1.05]"
        >
          Bejewelled Interpretations
        </h2>
        <p className="mt-5 max-w-md text-[0.95rem] leading-[1.8] text-white/82">
          Rare stones are studied, balanced, and composed into pieces that celebrate
          light, symmetry, and emotion.
        </p>
        <LuxuryButton className="mt-6" href="/bespoke" inverse>
          Observe Its Brilliance
        </LuxuryButton>
      </div>
    </section>
  );
}
