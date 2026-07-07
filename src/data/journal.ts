import type { HeroImageConfig, ProductionImage } from "@/data/assets";
import { journalArticles } from "@/lib/mdx";

export type JournalEntry = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  category: string;
  excerpt: string;
  readingTime: string;
  image: ProductionImage;
  hero: HeroImageConfig;
};

const articleHeroControls: Record<
  string,
  Pick<HeroImageConfig, "heroObjectPositionDesktop" | "heroObjectPositionMobile" | "heroOverlayStyle" | "heroTheme">
> = {
  "line-and-light": {
    heroObjectPositionDesktop: "58% center",
    heroObjectPositionMobile: "52% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  "rare-color-stories": {
    heroObjectPositionDesktop: "62% center",
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  "choose-a-gemstone": {
    heroObjectPositionDesktop: "62% center",
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  "timeless-jewellery": {
    heroObjectPositionDesktop: "66% center",
    heroObjectPositionMobile: "58% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export const journalEntries: readonly JournalEntry[] = journalArticles.map(
  ({ frontmatter }) => {
    const image = { src: frontmatter.image, available: true };

    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      date: frontmatter.date,
      displayDate: dateFormatter.format(new Date(`${frontmatter.date}T00:00:00Z`)),
      category: frontmatter.category,
      excerpt: frontmatter.description,
      readingTime: frontmatter.readingTime,
      image,
      hero: {
        heroImage: image,
        heroAlt: `${frontmatter.title} editorial hero image`,
        ...articleHeroControls[frontmatter.slug],
      },
    };
  },
);

export function getJournalEntry(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}
