import Link from "next/link";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { JournalEntry } from "@/data/journal";

export function JournalCard({ entry, featured = false, headingLevel = "h2" }: { entry: JournalEntry; featured?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="h-full">
      <Link className="group block" href={`/journal/${entry.slug}`}>
        <LuxuryImage alt={entry.title} asset={entry.image} className={featured ? "aspect-[5/4] bg-porcelain shadow-[0_22px_60px_rgb(23_20_17_/_0.055)] sm:aspect-[4/3]" : "aspect-[5/4] bg-porcelain shadow-[0_22px_60px_rgb(23_20_17_/_0.05)] sm:aspect-[16/10]"} imageClassName="object-cover brightness-[1.04] contrast-[0.98] transition-transform duration-700 group-hover:scale-[1.015]" sizes={featured ? "(min-width: 1024px) 46vw, 92vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"} />
        <div className="pt-5">
          <p className="text-[0.58rem] uppercase tracking-[0.23em] text-charcoal/46">{entry.category} · {entry.displayDate}</p>
          <Heading className={`${featured ? "text-[clamp(1.8rem,3.2vw,3.4rem)]" : "text-2xl"} mt-3 font-serif font-normal leading-[1.14]`}>{entry.title}</Heading>
          <p className="mt-3 text-sm leading-6 text-charcoal/62">{entry.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
