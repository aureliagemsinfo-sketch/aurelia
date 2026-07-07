# Aurelia Gems Asset Checklist

## Production assets

- [x] `/public/videos/hero-gem-desert.mp4`
- [x] `/public/images/hero-gem-poster.jpg`

### Homepage editorial images

- [x] `/public/images/editorial/craftsmanship-brooch.png`
- [x] `/public/images/editorial/heritage-inspiration.png`
- [x] `/public/images/editorial/gemstone-water.png`
- [x] `/public/images/editorial/model-jewellery.png`
- [x] `/public/images/editorial/boutique-wood.png`
- [x] `/public/images/editorial/gift-campaign.png`

### Homepage product images

- [x] `/public/images/products/necklace-pendant.png`
- [x] `/public/images/products/bracelet.png`
- [x] `/public/images/products/earrings.png`
- [x] `/public/images/products/ring.png`
- [x] `/public/images/products/high-jewellery.png`
- [x] `/public/images/products/bridal-creations.png`

### Homepage journal images

- [x] `/public/images/journal/line-and-light.png`
- [x] `/public/images/journal/rare-color-stories.png`

## Reference screenshots

- [x] `/docs/reference/01-craftsmanship-story.png`
- [x] `/docs/reference/02-heritage-inspiration.png`
- [x] `/docs/reference/03-dark-campaign.png`
- [x] `/docs/reference/04-product-model-split.png`
- [x] `/docs/reference/05-boutique-banner.png`
- [x] `/docs/reference/06-gift-campaign.png`
- [x] `/docs/reference/07-creations-grid.png`
- [x] `/docs/reference/08-journal-section.png`
- [x] `/docs/reference/09-services-newsletter-footer.png`
- [x] `/docs/reference/10-navigation-drawer.png`

All required production assets and reference screenshots are present.

## Phase 6 WebP optimization

The original PNG files are retained as source assets. All 14 production PNGs were
converted to WebP at their original dimensions and the application now references
the optimized files below.

- [x] `/public/images/editorial/craftsmanship-brooch.webp` (230 KB)
- [x] `/public/images/editorial/heritage-inspiration.webp` (85 KB)
- [x] `/public/images/editorial/gemstone-water.webp` (91 KB)
- [x] `/public/images/editorial/model-jewellery.webp` (45 KB)
- [x] `/public/images/editorial/boutique-wood.webp` (246 KB)
- [x] `/public/images/editorial/gift-campaign.webp` (66 KB)
- [x] `/public/images/products/necklace-pendant.webp` (37 KB)
- [x] `/public/images/products/bracelet.webp` (63 KB)
- [x] `/public/images/products/earrings.webp` (80 KB)
- [x] `/public/images/products/ring.webp` (46 KB)
- [x] `/public/images/products/high-jewellery.webp` (140 KB)
- [x] `/public/images/products/bridal-creations.webp` (58 KB)
- [x] `/public/images/journal/line-and-light.webp` (112 KB)
- [x] `/public/images/journal/rare-color-stories.webp` (134 KB)

### Phase 6.4 art-directed variants

- [x] `/public/images/editorial/gift-campaign-wide-v2.webp` (true wide campaign export, original retained)
- [x] `/public/images/editorial/heritage-inspiration-mobile-v2.webp` (dedicated portrait crop, original retained)

No optimized production image is larger than 250 KB. The largest retained source
PNG is `craftsmanship-brooch.png` at 2.61 MB; it is no longer requested by the site.
