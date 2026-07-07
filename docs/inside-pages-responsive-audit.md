# Phase 6.8 Inside Pages Responsive Refinement

## Routes audited

- `/collections`
- `/collections/[slug]`
- `/jewellery`
- `/jewellery/[slug]`
- `/gemstones`
- `/gemstones/[slug]`
- `/journal`
- `/journal/[slug]`
- `/bespoke`
- `/appointment`
- `/contact`

## Responsive refinements

- Reduced inside-page hero heights across mobile and tablet so pages no longer open with oversized hero blocks.
- Rebalanced detail heroes to keep side-by-side editorial layouts from tablet upward while avoiding giant empty areas.
- Improved mobile hero aspect ratios so lead visuals retain presence without pushing copy too far down.
- Tightened section padding and grid gaps on listing/detail pages for a more controlled editorial rhythm.
- Improved card image ratios, soft shadows, brightness, and responsive `sizes` hints.
- Added more polished form surfaces for appointment and contact pages.
- Made CTAs stack cleanly on narrow screens and retain a refined inline rhythm on larger screens.

## Image strategy

Phase 6.7 introduced page-specific hero asset paths and a prompt manifest in `docs/hero-image-audit.md`. Phase 6.8 keeps that structure, brightens the fallback art direction, and favors lighter overlays with charcoal text so inside pages better match the homepage atmosphere.

Final `.webp` assets still need to be generated/dropped into `public/images/heroes/...`; the code is already wired to use them by flipping each matching `available` flag in `src/data/assets.ts`.
