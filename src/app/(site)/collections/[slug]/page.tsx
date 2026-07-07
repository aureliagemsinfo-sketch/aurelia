import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DetailHero } from "@/components/shared/DetailHero";
import { GemstoneCard } from "@/components/shared/GemstoneCard";
import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { RelatedCreations } from "@/components/shared/RelatedCreations";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import {
  getPublicCollectionBySlugWithFallback,
  listPublicCollectionSlugs,
} from "@/server/public-data/collections.public";
import { listPublicGemstonesWithFallback } from "@/server/public-data/gemstones.public";
import { listPublicProductsWithFallback } from "@/server/public-data/products.public";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await listPublicCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getPublicCollectionBySlugWithFallback((await params).slug);
  if (!collection) return { title: "Collection Not Found", robots: { index: false, follow: false } };
  return createPageMetadata(collection.name, collection.description, `/collections/${collection.slug}`, collection.image.src);
}

export default async function CollectionDetailPage({ params }: Props) {
  const collection = await getPublicCollectionBySlugWithFallback((await params).slug);
  if (!collection) notFound();
  const [allProducts, allGemstones] = await Promise.all([
    listPublicProductsWithFallback(),
    listPublicGemstonesWithFallback(),
  ]);
  const related = allProducts.filter((piece) => piece.collectionSlug === collection.slug);
  const relatedGems = collection.relatedGemSlugs
    .map((slug) => allGemstones.find((gemstone) => gemstone.slug === slug))
    .filter((gemstone): gemstone is (typeof allGemstones)[number] => Boolean(gemstone));

  return (
    <main>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: collection.name, description: collection.description, url: absoluteUrl(`/collections/${collection.slug}`), image: absoluteUrl(collection.image.src) }} />
      <DetailHero eyebrow={collection.eyebrow} title={collection.name} description={collection.description} {...collection.hero} />
      <section className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.name }]} />
          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1.45fr)] md:gap-10 lg:mt-12 xl:gap-14">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">The Collection Story</p>
            <div className="space-y-6">
              {collection.story.map((paragraph) => (
                <p className="font-serif text-[clamp(1.2rem,1.8vw,1.65rem)] leading-[1.5] text-charcoal/80" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-3 border-t border-soft-border pt-8 sm:grid-cols-3">
            {collection.highlights.map((highlight) => (
              <p className="border border-soft-border bg-porcelain/70 px-5 py-5 text-center text-[0.66rem] uppercase tracking-[0.18em] text-charcoal/58" key={highlight}>
                {highlight}
              </p>
            ))}
          </div>
        </div>
      </section>
      
      <RelatedCreations eyebrow="Creations in this Collection" pieces={related} title={`Jewellery from ${collection.name}`} />

      {relatedGems.length > 0 ? (
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
          <div className="mx-auto max-w-[94rem]">
            <div className="grid gap-7 border-b border-soft-border pb-9 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:items-end lg:pb-11">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Stones in this Collection</p>
                <h2 className="mt-5 max-w-3xl font-serif text-[var(--text-fluid-section)] font-normal leading-[1.06]">
                  Stones in this Collection
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-charcoal/62 md:justify-self-end">
                A curated selection of gemstones that shape this collection’s colour story.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:gap-7">
              {relatedGems.map((gemstone) => (
                <GemstoneCard gemstone={gemstone} headingLevel="h3" hideDetails={true} key={gemstone.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <InquiryCTA itemName={collection.name} itemSlug={collection.slug} itemType="collection" title={`Discover ${collection.name} in Private`} />
    </main>
  );
}
