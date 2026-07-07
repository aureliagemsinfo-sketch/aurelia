import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DetailHero } from "@/components/shared/DetailHero";
import { GemstoneCard } from "@/components/shared/GemstoneCard";
import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { JewelleryCard } from "@/components/shared/JewelleryCard";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { listPublicCollectionsWithFallback } from "@/server/public-data/collections.public";
import {
  getPublicGemstoneBySlugWithFallback,
  listPublicGemstonesWithFallback,
  listPublicGemstoneSlugs,
} from "@/server/public-data/gemstones.public";
import { listPublicProductsWithFallback } from "@/server/public-data/products.public";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await listPublicGemstoneSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gemstone = await getPublicGemstoneBySlugWithFallback((await params).slug);
  if (!gemstone) return { title: "Gemstone Not Found", robots: { index: false, follow: false } };
  return createPageMetadata(
    gemstone.name,
    gemstone.shortDescription,
    `/gemstones/${gemstone.slug}`,
    gemstone.primaryImage.available ? gemstone.primaryImage.src : undefined,
  );
}

export default async function GemstoneDetailPage({ params }: Props) {
  const gemstone = await getPublicGemstoneBySlugWithFallback((await params).slug);
  if (!gemstone) notFound();

  const [allProducts, allCollections, allGemstones] = await Promise.all([
    listPublicProductsWithFallback(),
    listPublicCollectionsWithFallback(),
    listPublicGemstonesWithFallback(),
  ]);
  const relatedProducts = allProducts.filter((piece) => gemstone.relatedJewellerySlugs.includes(piece.slug));
  const relatedCollections = allCollections.filter((collection) => gemstone.relatedCollectionSlugs.includes(collection.slug));
  const relatedGems = gemstone.relatedGemSlugs
    .map((slug) => allGemstones.find((relatedGemstone) => relatedGemstone.slug === slug))
    .filter((relatedGemstone): relatedGemstone is (typeof allGemstones)[number] => Boolean(relatedGemstone));
  const structuredDataImage = gemstone.primaryImage.available ? absoluteUrl(gemstone.primaryImage.src) : undefined;
  const heroDetails = [
    ["Origin", gemstone.originDisplay],
    ["Family", gemstone.family],
    ["Price", gemstone.priceLabel],
  ] as const;
  const profileRows = [
    ["Origin", gemstone.originDisplay],
    ["Family", gemstone.family],
    ["Type", gemstone.type],
    ["Colour", gemstone.color],
    ["Rarity", gemstone.rarity],
    ["Carat Range", gemstone.caratRange],
    ["Treatment", gemstone.treatment],
    ["Clarity", gemstone.clarity],
    ["Certification", gemstone.certification],
    ["Price", gemstone.priceLabel],
  ] as const;
  const acquisitionRows = [
    ["Cut Options", gemstone.cutOptions.join(", ")],
    ["Price Note", gemstone.priceNote],
    ["Care Notes", gemstone.careNotes],
  ] as const;

  const detailEyebrow = gemstone.originCountry === "Sri Lanka" ? "Ceylon Gem" : "Rare Gemstone";

  return (
    <main>
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: gemstone.name,
          description: gemstone.longDescription,
          url: absoluteUrl(`/gemstones/${gemstone.slug}`),
          image: structuredDataImage,
          about: { "@type": "Thing", name: gemstone.name, additionalType: gemstone.family },
        }}
      />
      <DetailHero
        eyebrow={detailEyebrow}
        title={gemstone.name}
        description={gemstone.shortDescription}
        heroImage={gemstone.heroImage}
        heroAlt={`${gemstone.name} gemstone profile`}
        heroObjectPositionDesktop="64% center"
        heroObjectPositionMobile="62% center"
        heroOverlayStyle="light"
        heroTheme="dark-text"
        details={
          <dl className="grid gap-5 sm:grid-cols-3">
            {heroDetails.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.56rem] uppercase tracking-[0.2em] text-charcoal/42">{label}</dt>
                <dd className="mt-2 text-sm leading-6 text-charcoal/72">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <section className="bg-soft-cream px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gemstones", href: "/gemstones" }, { label: gemstone.name }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="space-y-4">
              <LuxuryImage
                alt={`${gemstone.name} gemstone image`}
                asset={gemstone.primaryImage}
                className="aspect-[4/3] bg-porcelain shadow-[0_28px_80px_rgb(23_20_17_/_0.07)]"
                fallbackClassName="hero-art"
                imageClassName="object-cover"
                objectPosition="64% center"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              {gemstone.galleryImages.length > 1 ? (
                <div className="grid grid-cols-2 gap-4">
                  {gemstone.galleryImages.slice(0, 2).map((image, index) => (
                    <LuxuryImage
                      alt={`${gemstone.name} gallery ${index + 1}`}
                      asset={image}
                      className="aspect-square bg-porcelain shadow-[0_14px_36px_rgb(23_20_17_/_0.045)]"
                      fallbackClassName="hero-art"
                      imageClassName="object-cover"
                      key={`${image.src}-${index}`}
                      objectPosition="64% center"
                      sizes="(min-width: 1024px) 20vw, 46vw"
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="border border-soft-border bg-ivory/72 p-5 shadow-[0_22px_70px_rgb(23_20_17_/_0.035)] sm:p-7 lg:p-9">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Gem Profile</p>
              <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.07]">Colour, origin, and rarity</h2>
              <p className="mt-6 font-serif text-[clamp(1.2rem,1.8vw,1.65rem)] leading-[1.55] text-charcoal/82">{gemstone.longDescription}</p>
              <div className="mt-7 border-y border-soft-border py-5">
                <p className="text-[0.58rem] uppercase tracking-[0.23em] text-charcoal/44">Acquisition Note</p>
                <p className="mt-3 text-sm leading-7 text-charcoal/66">{gemstone.priceNote}</p>
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {gemstone.highlights.map((highlight) => (
                  <li className="border border-soft-border bg-porcelain/70 px-4 py-4 text-sm leading-6 text-charcoal/66" key={highlight}>
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="form-action inline-flex min-h-12 items-center justify-center border border-charcoal bg-charcoal px-7 text-center text-[0.68rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal" href={`/contact?subject=${encodeURIComponent(gemstone.inquirySubject)}`}>
                  Enquire About This Gem
                </Link>
                <Link className="form-action inline-flex min-h-12 items-center justify-center border border-champagne/70 px-7 text-center text-[0.68rem] uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-charcoal" href="/appointment">
                  Book a Gem Appointment
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Stone Dossier</p>
              <dl className="mt-7 grid border-t border-soft-border sm:grid-cols-2 lg:grid-cols-3">
                {profileRows.map(([label, value]) => (
                  <div className="border-b border-soft-border py-6 sm:px-6 sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0" key={label}>
                    <dt className="text-[0.58rem] uppercase tracking-[0.23em] text-charcoal/44">{label}</dt>
                    <dd className="mt-3 text-sm leading-7 text-charcoal/70">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <aside className="border border-soft-border bg-porcelain/74 p-5 sm:p-7">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Selection Notes</p>
              <dl className="mt-7 space-y-6">
                {acquisitionRows.map(([label, value]) => (
                  <div className="border-t border-soft-border pt-5" key={label}>
                    <dt className="text-[0.58rem] uppercase tracking-[0.23em] text-charcoal/44">{label}</dt>
                    <dd className="mt-3 text-sm leading-7 text-charcoal/70">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>
      {relatedCollections.length > 0 ? (
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
          <div className="mx-auto max-w-6xl">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Related Collections</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">Maison worlds for this stone</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal/62">
              Explore the collection stories where this stone’s colour, symbolism, or optical character can guide a private commission.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCollections.map((collection) => (
                <Link className="border border-soft-border bg-ivory/65 p-6 transition-colors hover:bg-soft-cream sm:p-7" href={`/collections/${collection.slug}`} key={collection.slug}>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-champagne">{collection.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-2xl font-normal">{collection.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-charcoal/62">{collection.description}</p>
                  <span className="luxury-link mt-6 inline-block text-[0.64rem] uppercase tracking-[0.2em]">View collection</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {relatedGems.length > 0 ? (
        <section className="bg-porcelain px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
          <div className="mx-auto max-w-[94rem]">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Related Gems</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">Continue the colour study</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal/62">
              Compare neighbouring colours, optical effects, and collector stones before choosing the tone of a bespoke piece.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:gap-7">
              {relatedGems.map((relatedGemstone) => (
                <GemstoneCard gemstone={relatedGemstone} headingLevel="h3" key={relatedGemstone.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {relatedProducts.length > 0 ? (
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
          <div className="mx-auto max-w-[94rem]">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Jewellery Context</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">Creations with related stones</h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:gap-8">
              {relatedProducts.map((piece) => (
                <JewelleryCard headingLevel="h3" key={piece.slug} piece={piece} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <InquiryCTA itemName={gemstone.name} itemSlug={gemstone.slug} itemType="gemstone" title={`Explore ${gemstone.name} with a Specialist`} />
    </main>
  );
}
