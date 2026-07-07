export type ProductionImage = {
  src: string;
  available: boolean;
  placeholder?:
    | "appointment"
    | "bespoke"
    | "collections"
    | "contact"
    | "gemstone-alexandrite"
    | "gemstone-blue"
    | "gemstone-catseye"
    | "gemstone-emerald"
    | "gemstone-gold"
    | "gemstone-padparadscha"
    | "gemstone-ruby"
    | "gemstone-star"
    | "gemstone-tourmaline"
    | "jewellery"
    | "journal";
};

export type HeroOverlayStyle = "light" | "dark" | "gradient" | "none";
export type HeroTheme = "dark-text" | "light-text";

export type HeroImageConfig = {
  heroImage: ProductionImage;
  heroImageMobile?: ProductionImage;
  heroAlt: string;
  heroObjectPositionDesktop?: string;
  heroObjectPositionMobile?: string;
  heroOverlayStyle?: HeroOverlayStyle;
  heroTheme?: HeroTheme;
};

// When a final image is added under public/, switch its matching flag to true.
// LuxuryImage will then use Next/Image without any section-level code changes.
export const homepageImages = {
  craftsmanship: {
    src: "/images/editorial/craftsmanship-brooch.webp",
    available: true,
  },
  heritage: {
    src: "/images/editorial/heritage-inspiration.webp",
    available: true,
  },
  heritageMobile: {
    src: "/images/editorial/heritage-inspiration-mobile-v2.webp",
    available: true,
  },
  gemstoneWater: {
    src: "/images/editorial/gemstone-water.webp",
    available: true,
  },
  modelJewellery: {
    src: "/images/editorial/model-jewellery-campaign.webp",
    available: true,
  },
  boutique: {
    src: "/images/editorial/boutique-wood.webp",
    available: true,
  },
  gifts: {
    src: "/images/editorial/gift-campaign-wide-v2.webp",
    available: true,
  },
  necklace: {
    src: "/images/products/necklace-pendant.webp",
    available: true,
  },
  bracelet: {
    src: "/images/products/bracelet.webp",
    available: true,
  },
  earrings: {
    src: "/images/products/earrings.webp",
    available: true,
  },
  ring: {
    src: "/images/products/ring.webp",
    available: true,
  },
  highJewellery: {
    src: "/images/products/high-jewellery.webp",
    available: true,
  },
  bridal: {
    src: "/images/products/bridal-creations.webp",
    available: true,
  },
  journalLine: {
    src: "/images/journal/line-and-light.webp",
    available: true,
  },
  journalColor: {
    src: "/images/journal/rare-color-stories.webp",
    available: true,
  },
} as const satisfies Record<string, ProductionImage>;

// Planned page-specific hero assets. Missing assets intentionally render through
// the luxury CSS artwork fallback until final photography/AI stills are dropped
// into public/images/heroes/ and the related flag is switched to true.
export const heroImages = {
  collectionsOverview: {
    src: "/images/heroes/collections/collections-hero.webp",
    available: true,
    placeholder: "collections",
  },
  collectionDesertLight: {
    src: "/images/heroes/collections/collection-desert-light-collection-hero.webp",
    available: true,
    placeholder: "gemstone-gold",
  },
  collectionRubyFire: {
    src: "/images/heroes/collections/collection-ruby-fire-collection-hero.webp",
    available: true,
    placeholder: "gemstone-ruby",
  },
  collectionEmeraldGarden: {
    src: "/images/heroes/collections/collection-emerald-garden-collection-hero.webp",
    available: true,
    placeholder: "gemstone-emerald",
  },
  collectionBridalRadiance: {
    src: "/images/heroes/collections/collection-bridal-radiance-hero.webp",
    available: true,
    placeholder: "jewellery",
  },
  collectionOneOfAKind: {
    src: "/images/heroes/collections/collection-one-of-a-kind-creations-hero.webp",
    available: true,
    placeholder: "collections",
  },
  jewelleryOverview: {
    src: "/images/heroes/jewellery/jewellery-hero.webp",
    available: true,
    placeholder: "jewellery",
  },
  gemstonesOverview: {
    src: "/images/heroes/gemstones/gemstones-hero.webp",
    available: true,
    placeholder: "gemstone-blue",
  },
  gemstoneYellowDiamond: {
    src: "/images/heroes/gemstones/gemstone-yellow-diamond-hero.webp",
    available: true,
    placeholder: "gemstone-gold",
  },
  gemstoneRuby: {
    src: "/images/heroes/gemstones/gemstone-ruby-hero.webp",
    available: true,
    placeholder: "gemstone-ruby",
  },
  gemstoneEmerald: {
    src: "/images/heroes/gemstones/gemstone-emerald-hero.webp",
    available: true,
    placeholder: "gemstone-emerald",
  },
  gemstoneSapphire: {
    src: "/images/heroes/gemstones/gemstone-sapphire-hero.webp",
    available: true,
    placeholder: "gemstone-blue",
  },
  gemstoneSpinel: {
    src: "/images/heroes/gemstones/gemstone-spinel-hero.webp",
    available: true,
    placeholder: "gemstone-padparadscha",
  },
  gemstoneTourmaline: {
    src: "/images/heroes/gemstones/gemstone-tourmaline-hero.webp",
    available: true,
    placeholder: "gemstone-tourmaline",
  },
  bespoke: {
    src: "/images/heroes/services/bespoke-hero.webp",
    available: true,
    placeholder: "bespoke",
  },
  appointment: {
    src: "/images/heroes/services/appointment-hero.webp",
    available: true,
    placeholder: "appointment",
  },
  contact: {
    src: "/images/heroes/services/contact-hero.webp",
    available: true,
    placeholder: "contact",
  },
  journalOverview: {
    src: "/images/heroes/journal/journal-hero.webp",
    available: true,
    placeholder: "journal",
  },
} as const satisfies Record<string, ProductionImage>;

export const pageHeroConfigs = {
  collections: {
    heroImage: heroImages.collectionsOverview,
    heroAlt: "Maison jewellery creations arranged as a refined collection still life",
    heroObjectPositionDesktop: "64% center",
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  jewellery: {
    heroImage: heroImages.jewelleryOverview,
    heroAlt: "Fine jewellery creations composed on a warm atelier surface",
    heroObjectPositionDesktop: "68% center",
    heroObjectPositionMobile: "58% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  gemstones: {
    heroImage: heroImages.gemstonesOverview,
    heroAlt: "Rare coloured gemstones arranged as a luminous maison study",
    heroObjectPositionDesktop: "64% center",
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  journal: {
    heroImage: heroImages.journalOverview,
    heroAlt: "Editorial gemstone notes, sketches, and jewel studies on an atelier table",
    heroObjectPositionDesktop: "62% center",
    heroObjectPositionMobile: "54% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  bespoke: {
    heroImage: heroImages.bespoke,
    heroAlt: "Bespoke jewellery sketches and selected gemstones in a private atelier",
    heroObjectPositionDesktop: "66% center",
    heroObjectPositionMobile: "56% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  appointment: {
    heroImage: heroImages.appointment,
    heroAlt: "Private jewellery appointment table with a tray and soft salon light",
    heroObjectPositionDesktop: "60% center",
    heroObjectPositionMobile: "52% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
  contact: {
    heroImage: heroImages.contact,
    heroAlt: "Calm maison concierge still life with stationery and a jewel tray",
    heroObjectPositionDesktop: "62% center",
    heroObjectPositionMobile: "54% center",
    heroOverlayStyle: "light",
    heroTheme: "dark-text",
  },
} as const satisfies Record<string, HeroImageConfig>;
