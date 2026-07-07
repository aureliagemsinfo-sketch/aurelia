# Aurelia Gems Media Art-Direction Checklist

This checklist records the production crop, exposure, and overlay decisions for the Phase 6.4 luminosity pass. Original source assets remain untouched.

| Media | Status | Desktop crop | Mobile crop | Overlay / exposure | Replacement note |
| --- | --- | --- | --- | --- | --- |
| Homepage hero video | Needs brighter version | Good | Good | Temporary `brightness(1.08) contrast(0.98) saturate(1.03)` treatment; warm overlays reduced | Produce a native brighter champagne-grade master before long-term archival delivery |
| Hero poster | Good | Good | Good | Shares the restrained video treatment; no zoom | Keep paired with the future regraded video |
| Craftsmanship image | Good | Good | Good | Needs less overlay: warm overlay reduced so the bench and brooch retain detail | No replacement needed |
| Heritage campaign | Good | Good | Dedicated mobile crop added | Soft porcelain fade only; no black overlay and no CSS scale | Desktop uses the original WebP; mobile uses `heritage-inspiration-mobile-v2.webp` |
| Dark gemstone campaign | Good | Good | Good | Intentionally low-key; image is subtly brighter and the teal bridge is less opaque | A brighter source export would be optional, not required |
| Model editorial | Good | Good | Good | Subtle image-only brightness lift | Consider a native high-key export in a future photography refresh |
| Boutique image | Good | Good | Good | Already luminous; retain natural treatment | No replacement needed |
| Gift campaign | Good | True 16:7-style wide export added | Center crop remains complete at 4:3 | No overlay and no CSS zoom | Uses `gift-campaign-wide-v2.webp`; original retained |
| Product images | Good | Good | Good | Neutral bright cards; no muddy overlays | No replacement needed |
| Journal images | Good | Good | Good | Natural editorial contrast | No replacement needed |

## Responsive crop checks

- [x] Desktop hero composition remains readable without a heavy black veil.
- [x] Heritage jewellery stays left while copy occupies the clean right field.
- [x] Heritage uses a dedicated portrait mobile composition with clear copy space.
- [x] Gift jewellery remains fully visible in the wide desktop campaign.
- [x] Gift center crop remains usable on small screens without transform scaling.
- [x] Dark campaign jewellery retains detail against luminous refined teal.
- [x] All art-directed variants continue through `LuxuryImage` / Next Image optimization.

## Production recommendation

Regenerate the hero video as a native brighter champagne-grade master. The current CSS treatment is deliberately subtle and safe for launch preparation, but should not replace proper color grading in the final archival media package.
