import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { JewelleryPiece } from "@/data/jewellery";

export function ProductGallery({ piece }: { piece: JewelleryPiece }) {
  const gallery = [piece.primaryImage, ...piece.galleryImages.filter((image) => image.src !== piece.primaryImage.src)];

  return (
    <section aria-label={`${piece.name} image gallery`} className="space-y-4">
      <LuxuryImage
        alt={piece.imagesAlt[0] ?? piece.name}
        asset={piece.primaryImage}
        className="aspect-[4/5] bg-white shadow-[0_28px_80px_rgb(23_20_17_/_0.07)] sm:aspect-square lg:sticky lg:top-28"
        imageClassName="object-contain p-[8%]"
        preload
        sizes="(min-width: 1024px) 48vw, 100vw"
      />
      {gallery.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {gallery.slice(0, 3).map((image, index) => (
            <LuxuryImage
              alt={piece.imagesAlt[index] ?? `${piece.name} gallery image ${index + 1}`}
              asset={image}
              className="aspect-square bg-white shadow-[0_14px_36px_rgb(23_20_17_/_0.045)]"
              imageClassName="object-contain p-[10%]"
              key={`${image.src}-${index}`}
              sizes="(min-width: 1024px) 15vw, 30vw"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
