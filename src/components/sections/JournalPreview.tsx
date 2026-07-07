import Link from "next/link";

import { journalArticles } from "@/data/home";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function JournalPreview() {
  return (
    <section id="journal" aria-labelledby="journal-heading" className="bg-ivory px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:py-32">
      <SectionHeading eyebrow="From the Maison" id="journal-heading" title="Journal" />
      <div className="mx-auto mt-12 grid max-w-[92rem] gap-10 sm:grid-cols-2 sm:gap-6 lg:gap-8 xl:mt-14">
        {journalArticles.map((article) => (
          <article key={article.title}>
            <Link aria-label={`Read ${article.title}`} className="group block" href={`/journal/${article.slug}`}>
              <LuxuryImage
                alt={article.title}
                asset={article.image}
                className="journal-visual"
                fallbackClassName={`journal-visual-${article.visual}`}
                imageClassName="transition-transform duration-700 group-hover:scale-[1.015]"
                sizes="(min-width: 640px) 47vw, 94vw"
                fallback={
                  <>
                    <span className="journal-orbit journal-orbit-one" />
                    <span className="journal-orbit journal-orbit-two" />
                    <span className="journal-stone journal-stone-one" />
                    <span className="journal-stone journal-stone-two" />
                    <span className="journal-stone journal-stone-three" />
                  </>
                }
              />
              <div className="pt-6 text-center sm:px-6">
                <p className="text-[0.6rem] uppercase tracking-[0.23em] text-charcoal/48">
                  Journal · {article.date}
                </p>
                <h3 className="mx-auto mt-4 max-w-2xl font-serif text-[clamp(1.35rem,2vw,2.25rem)] font-normal leading-[1.15] transition-opacity group-hover:opacity-60">
                  {article.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
