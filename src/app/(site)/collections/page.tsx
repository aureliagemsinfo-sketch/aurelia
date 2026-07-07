import type { Metadata } from "next";

import { CollectionCard } from "@/components/shared/CollectionCard";
import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { PageHero } from "@/components/shared/PageHero";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { listPublicCollectionsWithFallback } from "@/server/public-data/collections.public";

export const metadata: Metadata = createPageMetadata("Jewellery Collections", "Explore Aurelia Gems collections shaped by rare stones, light, and exceptional craftsmanship.", "/collections");

export default async function CollectionsPage() {
  const collections = await listPublicCollectionsWithFallback();

  return (
    <main>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Aurelia Gems Jewellery Collections", url: absoluteUrl("/collections"), description: metadata.description }} />
      <PageHero eyebrow="The Collections" title="Stories Told in Rare Stones" description="Five distinct worlds, each composed around colour, emotion, and the hand of the atelier." {...pageHeroConfigs.collections} />
      <section className="bg-ivory px-5 py-16 sm:px-8 sm:py-[5.5rem] lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">The Maison’s Creative Universe</p>
          <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.05]">Created Around the Character of Every Stone</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[0.95rem] leading-[1.8] text-charcoal/64">Aurelia collections begin with a feeling: desert warmth, botanical movement, the intensity of ruby, or the clarity of a promise.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-[94rem] gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:gap-x-8">
          {collections.map((collection) => <CollectionCard collection={collection} key={collection.slug} />)}
        </div>
      </section>
      <InquiryCTA title="Discover a Collection in Private" />
    </main>
  );
}
