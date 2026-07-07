import { heroImages, homepageImages, type HeroImageConfig, type ProductionImage } from "@/data/assets";

export type Collection = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  highlights: readonly string[];
  story: readonly string[];
  image: ProductionImage;
  galleryImages?: readonly ProductionImage[];
  imagePosition?: string;
  hero: HeroImageConfig;
  relatedGemSlugs: readonly string[];
  relatedJewellerySlugs: readonly string[];
};

export const collections: readonly Collection[] = [
  {
    slug: "desert-light-collection",
    name: "Desert Light Collection",
    eyebrow: "Earth · Light · Gold",
    description:
      "Golden stones and sculpted forms capture the still brilliance of a desert horizon.",
    highlights: ["Golden gemstones", "Sculpted yellow gold", "Warm everyday radiance"],
    story: [
      "Desert Light begins where the horizon softens into gold. Citrine, yellow diamond, and polished metal are composed to hold the warmth of that fleeting hour.",
      "Each creation balances generous light with precise handwork, allowing the gemstone to remain the quiet centre of the story.",
    ],
    image: homepageImages.heritage,
    galleryImages: [homepageImages.heritage, homepageImages.gifts],
    imagePosition: "35% center",
    hero: {
      heroImage: heroImages.collectionDesertLight,
      heroAlt: "Golden gemstones and warm gold forms arranged for the Desert Light collection",
      heroObjectPositionDesktop: "62% center",
      heroObjectPositionMobile: "56% center",
      heroOverlayStyle: "light",
      heroTheme: "dark-text",
    },
    relatedGemSlugs: ["ceylon-blue-sapphire", "topaz", "zircon", "cats-eye"],
    relatedJewellerySlugs: ["liora-blossom-ring", "desert-light-necklace"],
  },
  {
    slug: "ruby-fire-collection",
    name: "Ruby Fire Collection",
    eyebrow: "Intensity · Devotion · Flame",
    description:
      "Ruby compositions shaped around movement, inner fire, and enduring emotion.",
    highlights: ["Ruby colour studies", "Diamond contrast", "Ceremonial intensity"],
    story: [
      "Ruby Fire studies the many expressions of red—from a quiet ember to a vivid flame. Every stone is chosen for saturation, life, and character.",
      "The collection sets this intensity against luminous diamonds and warm gold, creating jewels with presence rather than excess.",
    ],
    image: homepageImages.craftsmanship,
    galleryImages: [homepageImages.craftsmanship, homepageImages.highJewellery],
    imagePosition: "70% center",
    hero: {
      heroImage: heroImages.collectionRubyFire,
      heroAlt: "Ruby and diamond composition glowing with warm maison light",
      heroObjectPositionDesktop: "64% center",
      heroObjectPositionMobile: "58% center",
      heroOverlayStyle: "light",
      heroTheme: "dark-text",
    },
    relatedGemSlugs: ["ruby", "spinel", "garnet"],
    relatedJewellerySlugs: ["nocturne-bracelet", "celeste-diamond-earrings"],
  },
  {
    slug: "emerald-garden-collection",
    name: "Emerald Garden Collection",
    eyebrow: "Nature · Renewal · Grace",
    description:
      "Emeralds and botanical lines meet in a garden imagined through precious form.",
    highlights: ["Botanical silhouettes", "Green gemstone character", "Diamond dew accents"],
    story: [
      "Emerald Garden translates leaves, water, and unfurling petals into fluid gold settings. The geometry of each emerald provides a disciplined counterpoint to nature’s softness.",
      "Diamonds are placed like points of dew, bringing clarity and rhythm to every silhouette.",
    ],
    image: homepageImages.gemstoneWater,
    galleryImages: [homepageImages.gemstoneWater, homepageImages.heritage],
    imagePosition: "62% center",
    hero: {
      heroImage: heroImages.collectionEmeraldGarden,
      heroAlt: "Emerald botanical jewellery mood with green stone and diamond light",
      heroObjectPositionDesktop: "64% center",
      heroObjectPositionMobile: "56% center",
      heroOverlayStyle: "light",
      heroTheme: "dark-text",
    },
    relatedGemSlugs: ["tourmaline", "alexandrite", "ceylon-blue-sapphire"],
    relatedJewellerySlugs: ["aurelia-pendant", "nocturne-bracelet"],
  },
  {
    slug: "bridal-radiance",
    name: "Bridal Radiance",
    eyebrow: "Promise · Clarity · Union",
    description:
      "Diamond creations made to honour a promise with clarity, balance, and light.",
    highlights: ["Bridal appointments", "Diamond harmony", "Made-to-size creations"],
    story: [
      "Bridal Radiance is guided by proportion and personal meaning. The maison considers how every line meets the hand and how every diamond carries light through daily life.",
      "From the first private consultation to the final fitting, each creation is shaped as an intimate expression of commitment.",
    ],
    image: homepageImages.bridal,
    galleryImages: [homepageImages.bridal, homepageImages.earrings],
    hero: {
      heroImage: heroImages.collectionBridalRadiance,
      heroAlt: "Diamond bridal creations arranged with soft ceremonial light",
      heroObjectPositionDesktop: "60% center",
      heroObjectPositionMobile: "52% center",
      heroOverlayStyle: "light",
      heroTheme: "dark-text",
    },
    relatedGemSlugs: ["ceylon-blue-sapphire", "moonstone", "zircon"],
    relatedJewellerySlugs: ["bridal-halo-set", "celeste-diamond-earrings"],
  },
  {
    slug: "one-of-a-kind-creations",
    name: "One-of-a-Kind Creations",
    eyebrow: "Rarity · Imagination · Mastery",
    description:
      "Singular jewels composed around stones whose character can never be repeated.",
    highlights: ["One-of-a-kind jewels", "Collector stones", "Private presentation"],
    story: [
      "Some stones invite a single answer. Their colour, scale, and natural history lead the atelier toward a form that exists only once.",
      "These creations bring gemological expertise and high jewellery craftsmanship together in pieces made for one collector and one moment in time.",
    ],
    image: homepageImages.highJewellery,
    galleryImages: [homepageImages.highJewellery, homepageImages.gemstoneWater],
    hero: {
      heroImage: heroImages.collectionOneOfAKind,
      heroAlt: "Singular high jewellery creation composed around rare coloured stones",
      heroObjectPositionDesktop: "62% center",
      heroObjectPositionMobile: "56% center",
      heroOverlayStyle: "light",
      heroTheme: "dark-text",
    },
    relatedGemSlugs: ["alexandrite", "padparadscha-sapphire", "star-sapphire", "cats-eye"],
    relatedJewellerySlugs: ["desert-light-necklace", "aurelia-pendant"],
  },
];

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
