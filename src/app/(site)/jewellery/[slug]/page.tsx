import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GemstoneDetails } from "@/components/shared/GemstoneDetails";
import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { ProductGallery } from "@/components/shared/ProductGallery";
import { ProductInfoPanel } from "@/components/shared/ProductInfoPanel";
import { ProductSpecifications } from "@/components/shared/ProductSpecifications";
import { RelatedCreations } from "@/components/shared/RelatedCreations";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import {
  getPublicProductBySlugWithFallback,
  listPublicProductsWithFallback,
  listPublicProductSlugs,
} from "@/server/public-data/products.public";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await listPublicProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = await getPublicProductBySlugWithFallback((await params).slug);
  if (!piece) return { title: "Creation Not Found", robots: { index: false, follow: false } };
  return createPageMetadata(piece.name, piece.shortDescription, `/jewellery/${piece.slug}`, piece.primaryImage.src);
}

export default async function JewelleryDetailPage({ params }: Props) {
  const piece = await getPublicProductBySlugWithFallback((await params).slug);
  if (!piece) notFound();

  const allProducts = await listPublicProductsWithFallback();
  const related = piece.relatedProductSlugs
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter((product): product is (typeof allProducts)[number] => Boolean(product));

  return (
    <main className="bg-ivory">
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: piece.name,
          sku: piece.referenceCode,
          description: piece.longDescription,
          image: piece.galleryImages.map((image) => absoluteUrl(image.src)),
          category: piece.category,
          material: piece.metal,
          brand: { "@type": "Brand", name: "Aurelia Gems" },
          offers: {
            "@type": "Offer",
            availability: piece.availability,
            price: piece.price ?? undefined,
            priceCurrency: piece.currency ?? undefined,
          },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Collection", value: piece.collectionName },
            { "@type": "PropertyValue", name: "Total carat weight", value: piece.totalCaratWeight },
            { "@type": "PropertyValue", name: "Reference", value: piece.referenceCode },
          ],
        }}
      />
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-[5.5rem]">
        <div className="mx-auto max-w-[94rem]">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Jewellery", href: "/jewellery" },
              { label: piece.collectionName, href: `/collections/${piece.collectionSlug}` },
              { label: piece.name },
            ]}
          />
          <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-12 xl:gap-16">
            <ProductGallery piece={piece} />
            <ProductInfoPanel piece={piece} />
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:gap-14">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Maison Note</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.08]">
              A profile of the creation
            </h2>
          </div>
          <div className="space-y-6">
            <p className="font-serif text-[clamp(1.25rem,1.8vw,1.75rem)] leading-[1.55] text-charcoal/82">
              {piece.longDescription}
            </p>
            <p className="text-sm leading-7 text-charcoal/62">
              This is placeholder product information for Phase 6.13. It is structured so a future admin panel can replace the static values with managed product records.
            </p>
          </div>
        </div>
      </section>
      <GemstoneDetails piece={piece} />
      <ProductSpecifications piece={piece} />
      <RelatedCreations pieces={related} title="Related creations" />
      <InquiryCTA itemName={piece.name} itemSlug={piece.slug} itemType="product" title={`Enquire About ${piece.name}`} />
    </main>
  );
}
