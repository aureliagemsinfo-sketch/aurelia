import { GemstoneCard } from "@/components/shared/GemstoneCard";
import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { listPublicFeaturedGemstonesWithFallback } from "@/server/public-data/gemstones.public";

export async function CreationCategoryGrid() {
  const featuredGemstones = await listPublicFeaturedGemstonesWithFallback(6);

  return (
    <section id="creations" aria-labelledby="creations-heading" className="bg-ivory border-t border-soft-border pt-24 sm:pt-32">
      <div className="px-6 pb-8 sm:pb-10">
        <SectionHeading
          description="Explore rare gemstones chosen for their origin, colour, clarity, and suitability for bespoke creations."
          eyebrow="Gemstone Catalogue"
          id="creations-heading"
          title="Selected Stones of Colour and Character"
        />
      </div>
      <div className="grid border-y border-soft-border px-5 py-10 sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:px-12 xl:px-16">
        {featuredGemstones.map((gemstone) => (
          <div
            className="border-b border-soft-border px-0 py-8 sm:px-4 md:px-5 [&:nth-last-child(-n+1)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+3)]:border-b-0"
            key={gemstone.slug}
          >
            <GemstoneCard gemstone={gemstone} headingLevel="h3" />
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center pb-16 sm:pb-20">
        <LuxuryButton href="/gemstones">Explore the Gem Catalogue</LuxuryButton>
      </div>
    </section>
  );
}
