# Phase 6.7 Hero Image Audit and Asset Plan

## Audit summary

| Page | Previous issue | Phase 6.7 action |
| --- | --- | --- |
| `/` | Homepage hero already has its own video/poster system. | Left unchanged except existing hero crop controls remain in global CSS. |
| `/collections` | Reused homepage craftsmanship image, too specific for a collection overview. | Wired to `pageHeroConfigs.collections` with a planned collection still-life hero and responsive crop controls. |
| `/collections/[slug]` | Detail pages used card/homepage imagery directly. | Added collection-specific `hero` configs for Desert Light, Ruby Fire, Emerald Garden, Bridal Radiance, and One-of-a-Kind Creations. |
| `/jewellery` | Reused model/editorial homepage image. | Wired to `pageHeroConfigs.jewellery` for an overview jewellery still-life direction. |
| `/jewellery/[slug]` | Product detail heroes had no per-piece crop controls. | Added per-piece hero configs using the product image as the anchor with detail-safe object positions. |
| `/gemstones` | Used one generic water/editorial image for the whole stone expertise page. | Wired to a gemstone-led planned hero with light-text gradient support. |
| `/gemstones/[slug]` | Several details used unrelated jewellery or journal imagery. | Added stone-specific hero configs and planned hero paths for yellow diamond, ruby, emerald, sapphire, spinel, and tourmaline. |
| `/journal` | Used a journal image but no dedicated hero plan/crop control. | Wired to `pageHeroConfigs.journal` for an editorial notes/sketches hero direction. |
| `/journal/[slug]` | Article detail heroes reused article images without page-level crop/overlay control. | Added per-article hero controls while preserving article images and metadata. |
| `/bespoke` | Reused homepage craftsmanship image. | Wired to a bespoke atelier/sketch/gemstone-selection hero direction. |
| `/appointment` | Used boutique image without appointment-specific hero intent. | Wired to a private salon/consultation-table hero direction. |
| `/contact` | Reused gift campaign image. | Wired to a calm concierge/maison still-life hero direction. |

## Planned hero asset paths

These entries are already represented in `src/data/assets.ts`. As of Phase 6.9, the planned `.webp` files have been generated and the matching flags are set to `true`. They render through CSS fallback artwork only if a future asset is added with `available` set to `false`.

- `public/images/heroes/collections/collections-hero.webp`
- `public/images/heroes/collections/collection-desert-light-collection-hero.webp`
- `public/images/heroes/collections/collection-ruby-fire-collection-hero.webp`
- `public/images/heroes/collections/collection-emerald-garden-collection-hero.webp`
- `public/images/heroes/collections/collection-bridal-radiance-hero.webp`
- `public/images/heroes/collections/collection-one-of-a-kind-creations-hero.webp`
- `public/images/heroes/jewellery/jewellery-hero.webp`
- `public/images/heroes/gemstones/gemstones-hero.webp`
- `public/images/heroes/gemstones/gemstone-yellow-diamond-hero.webp`
- `public/images/heroes/gemstones/gemstone-ruby-hero.webp`
- `public/images/heroes/gemstones/gemstone-emerald-hero.webp`
- `public/images/heroes/gemstones/gemstone-sapphire-hero.webp`
- `public/images/heroes/gemstones/gemstone-spinel-hero.webp`
- `public/images/heroes/gemstones/gemstone-tourmaline-hero.webp`
- `public/images/heroes/journal/journal-hero.webp`
- `public/images/heroes/services/bespoke-hero.webp`
- `public/images/heroes/services/appointment-hero.webp`
- `public/images/heroes/services/contact-hero.webp`

## Image generation prompts

Use these as art-direction prompts for final asset production. Keep outputs original to Aurelia Gems and avoid copying a reference maison directly.

- Collections overview: refined luxury still life of several fine jewellery creations with rare coloured stones on warm ivory silk, airy negative space on the left, premium maison catalogue lighting, no visible logos.
- Desert Light collection: golden gemstones and sculptural yellow-gold jewellery on a soft sand-toned atelier surface, warm horizon light, elegant right-weighted composition.
- Ruby Fire collection: ruby and diamond jewellery in deep crimson and gold light, restrained dramatic shadows, jewel positioned to the right with breathable negative space.
- Emerald Garden collection: emerald gemstone and botanical gold forms with diamond dew-like accents, fresh green mood, luminous but not washed out.
- Bridal Radiance collection: diamond bridal ring set on ivory satin and warm champagne tray, quiet ceremonial mood, soft private-salon light.
- One-of-a-Kind collection: rare multi-colour high jewellery composition around a singular centre stone, museum-like lighting, rich but uncluttered.
- Jewellery overview: curated fine jewellery creations on a warm atelier tray, polished gold, diamonds, soft ivory background, premium editorial crop.
- Gemstones overview: loose rare gemstones in blue, green, gold, and ruby tones on parchment and silk, gemological study mood, strong sparkle but calm composition.
- Gemstone details: single stone-led macro still life matching the stone colour story, premium light, right-side focal point, uncluttered left side for typography.
- Journal overview: atelier notes, stone sketches, loupe, pencil, and small gemstones on an ivory desk, editorial storytelling mood.
- Bespoke: jewellery sketches, selected gemstones, tracing paper, and gold tools on a private atelier table.
- Appointment: private consultation table with jewellery tray, champagne-toned salon light, hospitality and discretion.
- Contact: calm concierge still life with card, envelope, soft jewel tray, warm ivory and champagne palette.
