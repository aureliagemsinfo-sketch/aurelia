import type { Metadata } from "next";

import { GemstoneCard } from "@/components/shared/GemstoneCard";
import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { PageHero } from "@/components/shared/PageHero";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";
import { listPublicGemstonesWithFallback } from "@/server/public-data/gemstones.public";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = createPageMetadata(
  "Gemstone Catalogue",
  "Explore rare gemstones chosen for their origin, colour, clarity, and suitability for bespoke creations.",
  "/gemstones",
);

export default async function GemstonesPage() {
  const orderedGemstones = await listPublicGemstonesWithFallback();

  return (
    <main>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Aurelia Gems Gemstone Catalogue", url: absoluteUrl("/gemstones") }} />
      <PageHero
        eyebrow="Gemstone Catalogue"
        title="Selected Stones of Colour and Character"
        description="Explore rare gemstones chosen for their origin, colour, clarity, and suitability for bespoke creations."
        {...pageHeroConfigs.gemstones}
      />
      <section className="bg-soft-cream px-5 py-16 sm:px-8 sm:py-[5.5rem] lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[94rem] gap-8 border-b border-soft-border pb-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-end lg:pb-12">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Gemological Knowledge</p>
            <h2 className="mt-5 max-w-3xl font-serif text-[var(--text-fluid-section)] font-normal leading-[1.06]">
              Every Stone Begins with Origin
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              [String(orderedGemstones.length), "Gem profiles"],
              ["Global", "Origin-led selection"],
              ["Private", "Sourcing guidance"],
            ].map(([value, label]) => (
              <div className="border border-soft-border bg-porcelain/70 px-5 py-5" key={label}>
                <p className="font-serif text-3xl font-normal leading-none">{value}</p>
                <p className="mt-3 text-[0.56rem] uppercase tracking-[0.2em] text-charcoal/46">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-[94rem] text-[0.95rem] leading-[1.8] text-charcoal/64 md:max-w-[58rem] md:pr-[22rem]">
          The maison considers origin, colour, cut, treatment, certification, and the individual life within each gemstone before it becomes part of a jewel.
        </p>
        <div className="mx-auto mt-12 grid max-w-[94rem] gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:gap-7">
          {orderedGemstones.map((gemstone) => (
            <GemstoneCard gemstone={gemstone} key={gemstone.slug} />
          ))}
        </div>
      </section>
      <InquiryCTA title="Begin with a Remarkable Stone" description="Meet privately with a gemstone specialist to explore colour, rarity, and the possibilities of a bespoke creation." />
    </main>
  );
}
