import { homepageImages, type ProductionImage } from "@/data/assets";

export type JournalArticle = {
  title: string;
  date: string;
  visual: "line" | "color";
  image: ProductionImage;
  slug: string;
};

export type Service = {
  heading: string;
  description: string;
  cta: string;
  href: string;
};

export const journalArticles: readonly JournalArticle[] = [
  {
    title: "The Art of Line and Light: How Gemstones Shape a Design",
    date: "June 8, 2026",
    visual: "line",
    image: homepageImages.journalLine,
    slug: "line-and-light",
  },
  {
    title:
      "Rare Color Stories: Yellow, Green, and Ruby Stones in Modern Jewellery",
    date: "June 8, 2026",
    visual: "color",
    image: homepageImages.journalColor,
    slug: "rare-color-stories",
  },
];

export const services: readonly Service[] = [
  {
    heading: "Caring for Your Jewellery Creations",
    description: "Discover how to care for and preserve your jewellery over time.",
    cta: "Care & Services",
    href: "/contact",
  },
  {
    heading: "Our Jewellery Services",
    description:
      "Personalize, adjust, restore, or redesign your jewellery with our specialists.",
    cta: "Jewellery Care",
    href: "/appointment",
  },
  {
    heading: "Our Gemstone Services",
    description: "Source, evaluate, and select rare stones for bespoke creations.",
    cta: "Gemstone Consultation",
    href: "/gemstones",
  },
];

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Gemstones", href: "/gemstones" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Journal", href: "/journal" },
  { label: "Book an Appointment", href: "/appointment" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/aure_liagems/" },
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61591784850008" },
] as const;
