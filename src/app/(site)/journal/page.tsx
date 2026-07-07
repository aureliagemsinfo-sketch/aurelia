import type { Metadata } from "next";

import { JournalCard } from "@/components/shared/JournalCard";
import { PageHero } from "@/components/shared/PageHero";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { pageHeroConfigs } from "@/data/assets";
import { journalEntries } from "@/data/journal";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = createPageMetadata("Journal", "Read gemstone stories, design perspectives, and savoir-faire notes from the Aurelia Gems maison.", "/journal");

export default function JournalPage() {
  const featured = journalEntries.slice(0, 2);
  const remaining = journalEntries.slice(2);
  return (
    <main>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Aurelia Gems Journal", url: absoluteUrl("/journal") }} />
      <PageHero eyebrow="The Journal" title="Stories of Stone, Line, and Light" description="Notes from the atelier, conversations with colour, and the knowledge behind exceptional creations." {...pageHeroConfigs.journal} />
      <section className="bg-ivory px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[94rem] gap-10 sm:grid-cols-2 sm:gap-6 lg:gap-8">{featured.map((entry) => <JournalCard entry={entry} featured key={entry.slug} />)}</div>
        <div className="mx-auto mt-12 grid max-w-[94rem] gap-x-6 gap-y-11 border-t border-soft-border pt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:gap-x-8 xl:gap-y-14">{remaining.map((entry) => <JournalCard entry={entry} key={entry.slug} />)}</div>
      </section>
    </main>
  );
}
