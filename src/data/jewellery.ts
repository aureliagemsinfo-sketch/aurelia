import { homepageImages, type HeroImageConfig, type ProductionImage } from "@/data/assets";

export type JewelleryGemstone = {
  name: string;
  type: string;
  color: string;
  origin: string;
  cut: string;
  carat: string;
  treatment: string;
  clarity: string;
  setting: string;
};

export type JewelleryPiece = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collectionSlug: string;
  collectionName: string;
  shortDescription: string;
  longDescription: string;
  priceLabel: string;
  currency: "USD" | null;
  price: number | null;
  availability: string;
  referenceCode: string;
  primaryImage: ProductionImage;
  galleryImages: readonly ProductionImage[];
  heroImage: ProductionImage;
  imagesAlt: readonly string[];
  metal: string;
  gemstones: readonly JewelleryGemstone[];
  totalCaratWeight: string;
  dimensions: string;
  craftsmanship: string;
  careInstructions: string;
  certificateDetails: string;
  highlights: readonly string[];
  relatedProductSlugs: readonly string[];
  inquirySubject: string;

  // Legacy presentation aliases retained until the future admin/API layer lands.
  collection: string;
  craftDetails: readonly string[];
  description: string;
  gemstone: string;
  hero: HeroImageConfig;
  image: ProductionImage;
};

const heroFor = (image: ProductionImage, alt: string): HeroImageConfig => ({
  heroImage: image,
  heroAlt: alt,
  heroObjectPositionDesktop: "50% 46%",
  heroObjectPositionMobile: "50% 46%",
  heroOverlayStyle: "none",
  heroTheme: "dark-text",
});

export const jewellery: readonly JewelleryPiece[] = [
  {
    id: "AG-JW-001",
    slug: "aurelia-pendant",
    name: "Aurelia Pendant",
    category: "Necklaces & Pendants",
    collectionSlug: "emerald-garden-collection",
    collectionName: "Emerald Garden Collection",
    shortDescription:
      "A luminous pendant shaped around a Ceylon blue sapphire and a fine halo of diamonds.",
    longDescription:
      "The Aurelia Pendant is composed as a quiet vertical gesture: a pear-cut Ceylon blue sapphire suspended within a fine gold frame and softened by diamond light. It is designed for private daily ceremony, with proportion and movement kept intentionally graceful.",
    priceLabel: "USD 1,850",
    currency: "USD",
    price: 1850,
    availability: "Available for private enquiry",
    referenceCode: "AG-JW-001",
    primaryImage: homepageImages.necklace,
    galleryImages: [homepageImages.necklace, homepageImages.gemstoneWater, homepageImages.heritage],
    heroImage: homepageImages.necklace,
    imagesAlt: [
      "Aurelia Pendant in 18k yellow gold with sapphire and diamond",
      "Blue gemstone colour inspiration for the Aurelia Pendant",
      "Editorial maison setting for the Emerald Garden Collection",
    ],
    metal: "18k yellow gold",
    gemstones: [
      {
        name: "Ceylon Blue Sapphire",
        type: "Sapphire",
        color: "Cornflower blue",
        origin: "Sri Lanka",
        cut: "Pear cut",
        carat: "1.20 ct",
        treatment: "Heat treated",
        clarity: "Eye clean",
        setting: "Prong setting",
      },
      {
        name: "White Diamonds",
        type: "Diamond",
        color: "F-G",
        origin: "Responsible sourcing partners",
        cut: "Brilliant cut",
        carat: "0.18 ct",
        treatment: "None",
        clarity: "VS",
        setting: "Micro pavé halo",
      },
    ],
    totalCaratWeight: "1.38 ct",
    dimensions: "Pendant 18 mm x 7 mm; adjustable chain 40-45 cm",
    craftsmanship: "Openwork teardrop construction with hand-polished articulated chain",
    careInstructions: "Clean with a soft dry cloth and avoid perfume, chlorine, and ultrasonic cleaning.",
    certificateDetails: "Maison certificate of authenticity and gemstone summary card included.",
    highlights: ["Ceylon sapphire centre stone", "Adjustable chain", "Diamond halo", "Hand-polished gold"],
    relatedProductSlugs: ["liora-blossom-ring", "celeste-diamond-earrings", "desert-light-necklace"],
    inquirySubject: "Aurelia Pendant enquiry",
    collection: "Emerald Garden Collection",
    craftDetails: ["Openwork teardrop construction", "Graduated diamond halo", "Hand-polished articulated chain"],
    description: "A slender drop of colour suspended within polished gold and quiet brilliance.",
    gemstone: "Ceylon blue sapphire and diamond",
    hero: heroFor(homepageImages.necklace, "Aurelia Pendant suspended in warm gold and diamond light"),
    image: homepageImages.necklace,
  },
  {
    id: "AG-JW-002",
    slug: "nocturne-bracelet",
    name: "Nocturne Bracelet",
    category: "Bracelets",
    collectionSlug: "ruby-fire-collection",
    collectionName: "Ruby Fire Collection",
    shortDescription:
      "A supple bracelet of black spinel, ruby accents, and diamond points set in warm gold.",
    longDescription:
      "The Nocturne Bracelet translates evening light into a rhythmic jewel. Black spinel motifs alternate with ruby fire and diamond punctuation, joined by hidden articulated links that allow the line to move softly around the wrist.",
    priceLabel: "USD 2,400",
    currency: "USD",
    price: 2400,
    availability: "Made to order",
    referenceCode: "AG-JW-002",
    primaryImage: homepageImages.bracelet,
    galleryImages: [homepageImages.bracelet, homepageImages.craftsmanship, homepageImages.highJewellery],
    heroImage: homepageImages.bracelet,
    imagesAlt: [
      "Nocturne Bracelet in yellow gold with black spinel and diamonds",
      "Atelier handwork detail for the Nocturne Bracelet",
      "Ruby and diamond high jewellery colour mood",
    ],
    metal: "18k yellow gold",
    gemstones: [
      {
        name: "Black Spinel",
        type: "Spinel",
        color: "Midnight black",
        origin: "Tanzania",
        cut: "Custom floral cabochon",
        carat: "1.90 ct",
        treatment: "None",
        clarity: "Opaque polished",
        setting: "Bezel-set floral motif",
      },
      {
        name: "Ruby Accents",
        type: "Ruby",
        color: "Pigeon-blood red",
        origin: "Mozambique",
        cut: "Round cut",
        carat: "0.32 ct",
        treatment: "Heat treated",
        clarity: "Very slightly included",
        setting: "Flush setting",
      },
      {
        name: "White Diamonds",
        type: "Diamond",
        color: "F-G",
        origin: "Responsible sourcing partners",
        cut: "Brilliant cut",
        carat: "0.58 ct",
        treatment: "None",
        clarity: "VS",
        setting: "Pavé points",
      },
    ],
    totalCaratWeight: "2.80 ct",
    dimensions: "Bracelet length 17 cm with concealed safety clasp",
    craftsmanship: "Hidden articulated links and hand-cut floral motifs",
    careInstructions: "Store flat in its pouch and avoid impact against hard surfaces.",
    certificateDetails: "Maison certificate and atelier service record included.",
    highlights: ["Made-to-order bracelet", "Hidden clasp", "Ruby fire accents", "Supple articulated line"],
    relatedProductSlugs: ["desert-light-necklace", "celeste-diamond-earrings", "aurelia-pendant"],
    inquirySubject: "Nocturne Bracelet enquiry",
    collection: "Ruby Fire Collection",
    craftDetails: ["Hand-cut spinel floral motifs", "Hidden articulated links", "Integrated safety clasp"],
    description: "Midnight spinel blossoms alternate with ruby fire and diamond points in a supple line.",
    gemstone: "Black spinel, ruby, and diamond",
    hero: heroFor(homepageImages.bracelet, "Nocturne Bracelet arranged as a rhythmic spinel and diamond line"),
    image: homepageImages.bracelet,
  },
  {
    id: "AG-JW-003",
    slug: "celeste-diamond-earrings",
    name: "Celeste Diamond Earrings",
    category: "Earrings",
    collectionSlug: "bridal-radiance",
    collectionName: "Bridal Radiance",
    shortDescription:
      "Matched diamond earrings with an airy floral silhouette and softly polished yellow gold.",
    longDescription:
      "The Celeste Diamond Earrings are designed to sit close to the face with lightness and lift. Matched centre diamonds anchor looped gold petals, creating a refined jewel for ceremonies, evenings, and heirloom dressing.",
    priceLabel: "USD 2,150",
    currency: "USD",
    price: 2150,
    availability: "Available for private enquiry",
    referenceCode: "AG-JW-003",
    primaryImage: homepageImages.earrings,
    galleryImages: [homepageImages.earrings, homepageImages.bridal, homepageImages.modelJewellery],
    heroImage: homepageImages.earrings,
    imagesAlt: [
      "Celeste Diamond Earrings in yellow gold",
      "Bridal diamond jewellery editorial setting",
      "Model wearing an Aurelia gemstone creation",
    ],
    metal: "18k yellow gold",
    gemstones: [
      {
        name: "Matched White Diamonds",
        type: "Diamond",
        color: "F-G",
        origin: "Responsible sourcing partners",
        cut: "Brilliant cut",
        carat: "0.74 ct",
        treatment: "None",
        clarity: "VS",
        setting: "Prong-set centre stones",
      },
    ],
    totalCaratWeight: "0.74 ct",
    dimensions: "Each earring 16 mm x 12 mm",
    craftsmanship: "Mirror-polished looped petals with balanced post-and-clip fitting",
    careInstructions: "Wipe after wear and store separately to protect polished gold surfaces.",
    certificateDetails: "Maison certificate and diamond summary included.",
    highlights: ["Matched diamond pair", "Post-and-clip fitting", "Ceremonial silhouette", "Lightweight wear"],
    relatedProductSlugs: ["bridal-halo-set", "aurelia-pendant", "liora-blossom-ring"],
    inquirySubject: "Celeste Diamond Earrings enquiry",
    collection: "Bridal Radiance",
    craftDetails: ["Matched brilliant-cut centre diamonds", "Mirror-polished looped petals", "Balanced post-and-clip fitting"],
    description: "Paired diamond flowers with an airy gold silhouette designed to hold light close to the face.",
    gemstone: "Diamond",
    hero: heroFor(homepageImages.earrings, "Celeste Diamond Earrings paired in a refined jewellery portrait"),
    image: homepageImages.earrings,
  },
  {
    id: "AG-JW-004",
    slug: "liora-blossom-ring",
    name: "Liora Blossom Ring",
    category: "Rings",
    collectionSlug: "desert-light-collection",
    collectionName: "Desert Light Collection",
    shortDescription:
      "A golden botanical ring centred by citrine and traced with diamond light.",
    longDescription:
      "The Liora Blossom Ring holds the moment a flower opens toward warm light. Its oval citrine centre is framed by petal-like gold and diamond accents, balancing a joyful colour story with precise atelier finishing.",
    priceLabel: "USD 1,680",
    currency: "USD",
    price: 1680,
    availability: "Available for private enquiry",
    referenceCode: "AG-JW-004",
    primaryImage: homepageImages.ring,
    galleryImages: [homepageImages.ring, homepageImages.heritage, homepageImages.gifts],
    heroImage: homepageImages.ring,
    imagesAlt: [
      "Liora Blossom Ring with citrine and diamond",
      "Warm gold maison heritage inspiration",
      "Gift campaign still life with fine jewellery",
    ],
    metal: "18k yellow gold",
    gemstones: [
      {
        name: "Golden Citrine",
        type: "Citrine",
        color: "Honey gold",
        origin: "Brazil",
        cut: "Oval cut",
        carat: "1.06 ct",
        treatment: "Heat treated",
        clarity: "Eye clean",
        setting: "Prong centre setting",
      },
      {
        name: "White Diamonds",
        type: "Diamond",
        color: "G-H",
        origin: "Responsible sourcing partners",
        cut: "Marquise and brilliant cut",
        carat: "0.22 ct",
        treatment: "None",
        clarity: "VS-SI",
        setting: "Petal pavé accents",
      },
    ],
    totalCaratWeight: "1.28 ct",
    dimensions: "Ring head 19 mm x 15 mm; made to selected size",
    craftsmanship: "Hand-finished botanical setting with individually selected citrine",
    careInstructions: "Remove before exercise and protect from sudden temperature changes.",
    certificateDetails: "Maison certificate of authenticity included.",
    highlights: ["Botanical gold setting", "Oval citrine centre", "Diamond petal accents", "Made to selected size"],
    relatedProductSlugs: ["aurelia-pendant", "bridal-halo-set", "celeste-diamond-earrings"],
    inquirySubject: "Liora Blossom Ring enquiry",
    collection: "Desert Light Collection",
    craftDetails: ["Hand-finished botanical setting", "Individually selected oval citrine", "Pavé and marquise-cut diamond accents"],
    description: "A golden bloom held at the moment it opens, centred by citrine and traced with diamond light.",
    gemstone: "Citrine and diamond",
    hero: heroFor(homepageImages.ring, "Liora Blossom Ring centred as a warm citrine and diamond jewel"),
    image: homepageImages.ring,
  },
  {
    id: "AG-JW-005",
    slug: "desert-light-necklace",
    name: "Desert Light Necklace",
    category: "High Jewellery",
    collectionSlug: "one-of-a-kind-creations",
    collectionName: "One-of-a-Kind Creations",
    shortDescription:
      "A singular high jewellery collar where ruby, emerald, and diamond gather into radiant colour.",
    longDescription:
      "The Desert Light Necklace is a one-of-a-kind high jewellery creation composed around rare coloured stones. Its articulated architecture brings rubies, emeralds, and diamonds into a garden-like rhythm that sits with softness despite its scale.",
    priceLabel: "Price on request",
    currency: null,
    price: null,
    availability: "One-of-a-kind private presentation",
    referenceCode: "AG-HJ-001",
    primaryImage: homepageImages.highJewellery,
    galleryImages: [homepageImages.highJewellery, homepageImages.craftsmanship, homepageImages.gemstoneWater],
    heroImage: homepageImages.highJewellery,
    imagesAlt: [
      "Desert Light Necklace high jewellery colour composition",
      "Atelier craftsmanship for a high jewellery creation",
      "Gemstone water editorial mood with rare colour",
    ],
    metal: "18k yellow gold and platinum setting elements",
    gemstones: [
      {
        name: "Mozambique Rubies",
        type: "Ruby",
        color: "Saturated red",
        origin: "Mozambique",
        cut: "Mixed cut",
        carat: "5.40 ct",
        treatment: "Heat treated",
        clarity: "Natural inclusions",
        setting: "Prong and custom basket setting",
      },
      {
        name: "Zambian Emeralds",
        type: "Emerald",
        color: "Garden green",
        origin: "Zambia",
        cut: "Step and pear cut",
        carat: "4.65 ct",
        treatment: "Minor oil",
        clarity: "Characteristic jardin",
        setting: "Protective bezel and prong setting",
      },
      {
        name: "White Diamonds",
        type: "Diamond",
        color: "F-G",
        origin: "Responsible sourcing partners",
        cut: "Brilliant and marquise cut",
        carat: "3.10 ct",
        treatment: "None",
        clarity: "VS",
        setting: "Articulated pavé and accent settings",
      },
    ],
    totalCaratWeight: "13.15 ct",
    dimensions: "Collar-style necklace; adjusted during private fitting",
    craftsmanship: "Individually articulated high jewellery construction with more than one thousand hours of atelier work",
    careInstructions: "Professional maison inspection recommended annually; store in the fitted presentation case.",
    certificateDetails: "Maison high jewellery dossier and gemstone documentation supplied during private presentation.",
    highlights: ["One-of-a-kind creation", "Private fitting", "High jewellery dossier", "Articulated collar construction"],
    relatedProductSlugs: ["nocturne-bracelet", "aurelia-pendant", "liora-blossom-ring"],
    inquirySubject: "Desert Light Necklace private presentation",
    collection: "One-of-a-Kind Creations",
    craftDetails: ["Individually articulated high jewellery construction", "Mixed-cut ruby and emerald composition", "More than one thousand hours of atelier work"],
    description: "An exceptional collar where rare colour gathers into a radiant, garden-like composition.",
    gemstone: "Ruby, emerald, and diamond",
    hero: heroFor(homepageImages.highJewellery, "Desert Light Necklace shown as a high jewellery colour composition"),
    image: homepageImages.highJewellery,
  },
  {
    id: "AG-JW-006",
    slug: "bridal-halo-set",
    name: "Bridal Halo Set",
    category: "Bridal Creations",
    collectionSlug: "bridal-radiance",
    collectionName: "Bridal Radiance",
    shortDescription:
      "An engagement ring and wedding band composed as one continuous line of diamond light.",
    longDescription:
      "The Bridal Halo Set pairs an engagement ring with a contour-fitted companion band. Every diamond is selected for harmony, and the setting is finished to sit close to the hand with ceremonial clarity and everyday comfort.",
    priceLabel: "USD 3,900",
    currency: "USD",
    price: 3900,
    availability: "Made to order by size",
    referenceCode: "AG-BR-001",
    primaryImage: homepageImages.bridal,
    galleryImages: [homepageImages.bridal, homepageImages.earrings, homepageImages.boutique],
    heroImage: homepageImages.bridal,
    imagesAlt: [
      "Bridal Halo Set with engagement ring and wedding band",
      "Diamond earrings styled with bridal jewellery",
      "Private salon setting for bridal consultation",
    ],
    metal: "18k yellow gold or platinum by request",
    gemstones: [
      {
        name: "Centre Diamond",
        type: "Diamond",
        color: "F-G",
        origin: "Responsible sourcing partners",
        cut: "Brilliant cut",
        carat: "0.80 ct",
        treatment: "None",
        clarity: "VS",
        setting: "Halo prong setting",
      },
      {
        name: "Pavé Diamonds",
        type: "Diamond",
        color: "G-H",
        origin: "Responsible sourcing partners",
        cut: "Brilliant cut",
        carat: "0.42 ct",
        treatment: "None",
        clarity: "VS-SI",
        setting: "Pavé band and halo",
      },
    ],
    totalCaratWeight: "1.22 ct",
    dimensions: "Made to selected size; companion band contour-fitted",
    craftsmanship: "Hand-matched pavé diamonds and contour-fitted companion band",
    careInstructions: "Maison cleaning and prong inspection recommended every six months.",
    certificateDetails: "Maison certificate and diamond documentation included.",
    highlights: ["Engagement ring and band", "Contour fit", "Made to size", "Bridal consultation available"],
    relatedProductSlugs: ["celeste-diamond-earrings", "liora-blossom-ring", "aurelia-pendant"],
    inquirySubject: "Bridal Halo Set appointment",
    collection: "Bridal Radiance",
    craftDetails: ["Brilliant-cut centre diamond setting", "Hand-matched pavé diamonds", "Contour-fitted companion band"],
    description: "An engagement ring and wedding band composed as one continuous line of promise and light.",
    gemstone: "Diamond",
    hero: heroFor(homepageImages.bridal, "Bridal Halo Set composed as diamond promise jewellery"),
    image: homepageImages.bridal,
  },
];

export function getJewelleryPiece(slug: string) {
  return jewellery.find((piece) => piece.slug === slug);
}

export function getJewelleryByCollection(collectionSlug: string) {
  return jewellery.filter((piece) => piece.collectionSlug === collectionSlug);
}

export function getRelatedJewellery(piece: JewelleryPiece) {
  return piece.relatedProductSlugs
    .map((slug) => getJewelleryPiece(slug))
    .filter((relatedPiece): relatedPiece is JewelleryPiece => Boolean(relatedPiece));
}
