import Link from "next/link";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { Collection } from "@/data/collections";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <article className="h-full">
      <Link className="group block" href={`/collections/${collection.slug}`}>
        <LuxuryImage alt={collection.name} asset={collection.image} className="aspect-[5/4] bg-porcelain shadow-[0_22px_60px_rgb(23_20_17_/_0.06)] sm:aspect-[4/3]" imageClassName="object-cover brightness-[1.04] contrast-[0.98] transition-transform duration-700 group-hover:scale-[1.018]" sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw" />
        <div className="border-b border-soft-border py-6 sm:min-h-[13.5rem]">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/45">{collection.eyebrow}</p>
          <h2 className="mt-3 font-serif text-[var(--text-fluid-card-title)] font-normal leading-tight">{collection.name}</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal/62">{collection.description}</p>
        </div>
      </Link>
    </article>
  );
}
