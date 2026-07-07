import Link from "next/link";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { JewelleryPiece } from "@/data/jewellery";

export function JewelleryCard({ piece, headingLevel = "h2" }: { piece: JewelleryPiece; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const mainGemstone = piece.gemstones[0]?.type ?? piece.gemstone;

  return (
    <article className="h-full">
      <Link className="group block h-full" href={`/jewellery/${piece.slug}`}>
        <LuxuryImage
          alt={piece.imagesAlt[0] ?? piece.name}
          asset={piece.primaryImage}
          className="aspect-[5/4] bg-white shadow-[0_22px_60px_rgb(23_20_17_/_0.055)] sm:aspect-square"
          imageClassName="object-contain p-[8%] transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
        />
        <div className="px-2 py-6 text-center sm:min-h-[14rem]">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-charcoal/46">{piece.category}</p>
          <Heading className="mt-3 font-serif text-[1.15rem] font-normal leading-snug">{piece.name}</Heading>
          <p className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-charcoal/48">{piece.collectionName}</p>
          <p className="mt-3 text-sm leading-6 text-charcoal/64">
            {mainGemstone} · {piece.priceLabel}
          </p>
          <span className="luxury-link mt-5 inline-block text-[0.68rem] uppercase tracking-[0.2em]">View Creation</span>
        </div>
      </Link>
    </article>
  );
}
