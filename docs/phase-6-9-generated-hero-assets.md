# Phase 6.9 Generated Hero Assets

The built-in Codex image generation tool was available and used to create real inside-page hero images. The generated PNG outputs were copied into the project as optimized WebP files and resized/cropped to a consistent 16:9 hero format.

All files below are `2200 × 1238` WebP assets.

| Asset | Size |
| --- | ---: |
| `public/images/heroes/collections/collections-hero.webp` | 179 KB |
| `public/images/heroes/collections/collection-desert-light-collection-hero.webp` | 176 KB |
| `public/images/heroes/collections/collection-ruby-fire-collection-hero.webp` | 146 KB |
| `public/images/heroes/collections/collection-emerald-garden-collection-hero.webp` | 189 KB |
| `public/images/heroes/collections/collection-bridal-radiance-hero.webp` | 130 KB |
| `public/images/heroes/collections/collection-one-of-a-kind-creations-hero.webp` | 128 KB |
| `public/images/heroes/jewellery/jewellery-hero.webp` | 136 KB |
| `public/images/heroes/gemstones/gemstones-hero.webp` | 144 KB |
| `public/images/heroes/gemstones/gemstone-yellow-diamond-hero.webp` | 101 KB |
| `public/images/heroes/gemstones/gemstone-ruby-hero.webp` | 59 KB |
| `public/images/heroes/gemstones/gemstone-emerald-hero.webp` | 63 KB |
| `public/images/heroes/gemstones/gemstone-sapphire-hero.webp` | 114 KB |
| `public/images/heroes/gemstones/gemstone-spinel-hero.webp` | 132 KB |
| `public/images/heroes/gemstones/gemstone-tourmaline-hero.webp` | 88 KB |
| `public/images/heroes/journal/journal-hero.webp` | 97 KB |
| `public/images/heroes/services/bespoke-hero.webp` | 97 KB |
| `public/images/heroes/services/appointment-hero.webp` | 74 KB |
| `public/images/heroes/services/contact-hero.webp` | 89 KB |

## Wiring

`src/data/assets.ts` now marks all Phase 6.9 `heroImages` entries as `available: true`, so `PageHero` and `DetailHero` use Next/Image with these real files instead of CSS fallback artwork.

Fallback artwork remains available for future assets that may be added with `available: false`.
