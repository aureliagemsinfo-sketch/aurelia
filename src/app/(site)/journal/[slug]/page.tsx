import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { DetailHero } from "@/components/shared/DetailHero";
import { JournalCard } from "@/components/shared/JournalCard";
import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { getJournalEntry, journalEntries } from "@/data/journal";
import { getJournalArticle } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalEntries.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getJournalArticle((await params).slug);
  if (!article) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  const { frontmatter } = article;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: `/journal/${frontmatter.slug}` },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.date,
      url: `/journal/${frontmatter.slug}`,
      images: [{ url: frontmatter.image, alt: frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.image],
    },
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const entry = getJournalEntry(slug);
  const article = getJournalArticle(slug);
  if (!entry || !article) notFound();

  const related = journalEntries.filter((item) => item.slug !== entry.slug).slice(0, 3);

  return (
    <main>
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.date,
          image: absoluteUrl(entry.image.src),
          mainEntityOfPage: absoluteUrl(`/journal/${entry.slug}`),
          author: { "@type": "Organization", name: "Aurelia Gems" },
          publisher: { "@type": "Organization", name: "Aurelia Gems" },
        }}
      />
      <DetailHero
        eyebrow={`${entry.category} · ${entry.displayDate} · ${entry.readingTime}`}
        title={entry.title}
        description={entry.excerpt}
        {...entry.hero}
      />
      <article className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Journal", href: "/journal" },
              { label: entry.title },
            ]}
          />
          <div className="mt-10 sm:mt-12">
            {article.content.map((block, index) =>
              block.type === "heading" ? (
                <h2
                  className="mb-6 mt-14 font-serif text-[clamp(1.5rem,2.5vw,2.25rem)] font-normal first:mt-0"
                  key={`${block.text}-${index}`}
                >
                  {block.text}
                </h2>
              ) : (
                <p
                  className="mb-5 text-[0.95rem] leading-[1.8] text-charcoal/72"
                  key={`${block.text}-${index}`}
                >
                  {block.text}
                </p>
              ),
            )}
          </div>
        </div>
      </article>
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto max-w-[94rem]">
          <h2 className="font-serif text-[var(--text-fluid-section)] font-normal">Continue Reading</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-9">
            {related.map((item) => <JournalCard entry={item} headingLevel="h3" key={item.slug} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
