import type { Metadata } from "next";

import { InquiryCTA } from "@/components/shared/InquiryCTA";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata("Bespoke Jewellery", "Discover the five-stage Aurelia Gems bespoke jewellery process, from consultation to final presentation.", "/bespoke");

const stages = [
  ["01", "Private Consultation", "A quiet conversation about the wearer, the occasion, and the feeling the creation should hold."],
  ["02", "Gemstone Sourcing", "Our specialists present rare stones chosen for character, provenance, and harmony with the idea."],
  ["03", "Design Sketch", "The atelier develops proportion, movement, and setting through drawings made around the selected stone."],
  ["04", "Handcrafting", "Master artisans shape, set, polish, and refine every detail through patient handwork."],
  ["05", "Final Presentation", "The completed jewel is revealed in a private fitting and prepared for the life it will accompany."],
] as const;

export default function BespokePage() {
  return (
    <main>
      <PageHero eyebrow="The Bespoke Atelier" title="A Creation That Begins with You" description="From a rare stone and a private conversation, the maison composes a jewel that can exist only once." {...pageHeroConfigs.bespoke} />
      <section className="bg-ivory px-5 py-16 sm:px-8 sm:py-[5.5rem] lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[94rem]">
          <div className="max-w-3xl">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Five Considered Stages</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.05]">From First Idea to Final Light</h2>
          </div>
          <ol className="mt-10 border-t border-soft-border sm:mt-12">
            {stages.map(([number, title, description]) => (
              <li className="grid gap-4 border-b border-soft-border py-7 sm:grid-cols-[4.5rem_minmax(10rem,0.9fr)_minmax(0,1.35fr)] sm:items-start lg:grid-cols-[5rem_minmax(12rem,0.85fr)_minmax(0,1.45fr)]" key={number}>
                <span className="text-[0.62rem] tracking-[0.22em] text-charcoal/42">{number}</span>
                <h3 className="font-serif text-xl sm:text-[1.35rem] font-normal leading-snug">{title}</h3>
                <p className="text-[0.95rem] leading-[1.7] text-charcoal/62">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <InquiryCTA title="Begin Your Bespoke Journey" />
    </main>
  );
}
