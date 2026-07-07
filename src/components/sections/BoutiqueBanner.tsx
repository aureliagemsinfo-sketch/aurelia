import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function BoutiqueBanner() {
  return (
    <section
      id="boutique"
      aria-labelledby="boutique-heading"
      className="relative flex min-h-[32rem] items-start justify-center overflow-hidden px-6 py-16 text-center sm:min-h-[34rem] sm:py-16 lg:min-h-[38rem] xl:min-h-[42rem] xl:py-24"
    >
      <LuxuryImage
        alt="Warm carved wood interior of an Aurelia private salon"
        asset={homepageImages.boutique}
        className="absolute inset-0"
        fallbackClassName="wood-banner"
        imageClassName="object-center"
        sizes="100vw"
        fallback={
          <>
            <div aria-hidden="true" className="wood-inlay wood-inlay-one" />
            <div aria-hidden="true" className="wood-inlay wood-inlay-two" />
          </>
        }
      />
      <div aria-hidden="true" className="boutique-scrim absolute inset-0" />
      <div className="relative z-10 max-w-2xl">
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/58">
          Private Salons
        </p>
        <h2
          id="boutique-heading"
          className="font-serif text-fluid-section font-normal leading-[1.05]"
        >
          Dubai &amp; Switzerland
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-charcoal/72 sm:text-base">
          Open the doors to private gemstone viewings and bespoke jewellery
          consultations by appointment.
        </p>
        <LuxuryButton className="mt-6" href="/appointment">
          Find a Private Salon
        </LuxuryButton>
      </div>
    </section>
  );
}
