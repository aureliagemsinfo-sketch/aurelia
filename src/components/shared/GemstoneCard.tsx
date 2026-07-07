import Link from "next/link";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { Gemstone } from "@/data/gemstones";

export function GemstoneCard({
  gemstone,
  headingLevel = "h2",
  hideDetails = false,
}: {
  gemstone: Gemstone;
  headingLevel?: "h2" | "h3";
  hideDetails?: boolean;
}) {
  const Heading = headingLevel;

  return (
    <article className="h-full border border-soft-border bg-ivory/76 p-3 shadow-[0_18px_54px_rgb(23_20_17_/_0.035)] transition-colors duration-500 hover:bg-white">
      <Link className="group flex h-full flex-col" href={`/gemstones/${gemstone.slug}`}>
        <LuxuryImage
          alt={`${gemstone.name} gemstone study`}
          asset={gemstone.primaryImage}
          className="aspect-[5/4] bg-porcelain shadow-[0_22px_60px_rgb(23_20_17_/_0.06)] sm:aspect-[4/3]"
          fallbackClassName="hero-art flex items-center justify-center"
          imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
          objectPosition="64% center"
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
        />
        <div className="flex flex-1 flex-col px-2 pb-3 pt-6 sm:px-3 sm:pb-4">
          <p className="text-[0.58rem] uppercase tracking-[0.24em] text-champagne">{gemstone.originDisplay}</p>
          <Heading className="mt-3 font-serif text-[var(--text-fluid-card-title)] font-normal leading-[1.08] tracking-[-0.01em]">
            {gemstone.name}
          </Heading>
          <p className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-charcoal/46">
            {gemstone.family} {"\u00b7"} {gemstone.type}
          </p>
          {hideDetails ? (
            <div className="mt-5 border-t border-soft-border pt-5 text-sm leading-6 text-charcoal/64">
              <span className="text-[0.56rem] uppercase tracking-[0.18em] text-charcoal/38 block">Colour</span>
              <span className="mt-1.5 block">{gemstone.color}</span>
            </div>
          ) : (
            <dl className="mt-5 grid gap-4 border-t border-soft-border pt-5 text-sm leading-6 text-charcoal/64">
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.18em] text-charcoal/38">Colour</dt>
                <dd className="mt-1.5">{gemstone.color}</dd>
              </div>
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.18em] text-charcoal/38">Carat Range</dt>
                <dd className="mt-1.5">{gemstone.caratRange}</dd>
              </div>
              <div>
                <dt className="text-[0.56rem] uppercase tracking-[0.18em] text-charcoal/38">Price Guidance</dt>
                <dd className="mt-1.5">{gemstone.priceLabel}</dd>
              </div>
            </dl>
          )}
          <span className="luxury-link mt-auto inline-block pt-6 text-[0.68rem] uppercase tracking-[0.2em]">View gem</span>
        </div>
      </Link>
    </article>
  );
}
