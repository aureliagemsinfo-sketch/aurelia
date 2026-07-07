import type { Metadata } from "next";

import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { JewelleryCard } from "@/components/shared/JewelleryCard";
import { PageHero } from "@/components/shared/PageHero";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { listPublicProductsWithFallback } from "@/server/public-data/products.public";

export const metadata: Metadata = createPageMetadata("Fine Jewellery", "Discover Aurelia Gems rings, necklaces, earrings, bracelets, bridal pieces, and high jewellery.", "/jewellery");

const categories = ["All Creations", "Rings", "Necklaces", "Earrings", "Bracelets", "Bridal", "High Jewellery"] as const;

export default async function JewelleryPage() {
  const jewellery = await listPublicProductsWithFallback();

  return (
    <main>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Aurelia Gems Fine Jewellery", url: absoluteUrl("/jewellery") }} />
      <PageHero eyebrow="Fine Jewellery" title="Creations of Light and Meaning" description="Jewels composed for the body, shaped to gather memory, and finished by hand." {...pageHeroConfigs.jewellery} />
      <section className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <nav aria-label="Jewellery categories" className="mx-auto max-w-[94rem] border-y border-soft-border py-5">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">{categories.map((category, index) => <li className={`text-[0.6rem] uppercase tracking-[0.2em] ${index === 0 ? "text-charcoal" : "text-charcoal/45"}`} key={category}>{category}</li>)}</ul>
        </nav>
        <div className="mx-auto mt-12 grid max-w-[94rem] gap-x-6 gap-y-11 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:gap-x-8 xl:gap-y-14">
          {jewellery.map((piece) => <JewelleryCard key={piece.slug} piece={piece} />)}
        </div>
      </section>
      <InquiryCTA />
    </main>
  );
}
