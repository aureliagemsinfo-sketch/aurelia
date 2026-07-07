import { JewelleryCard } from "@/components/shared/JewelleryCard";
import type { JewelleryPiece } from "@/data/jewellery";

export function RelatedCreations({
  eyebrow = "Related Creations",
  pieces,
  title = "Continue the story",
}: {
  eyebrow?: string;
  pieces: readonly JewelleryPiece[];
  title?: string;
}) {
  if (pieces.length === 0) return null;

  return (
    <section className="bg-porcelain px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
      <div className="mx-auto max-w-[94rem]">
        <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">{eyebrow}</p>
        <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">{title}</h2>
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:gap-8">
          {pieces.map((piece) => (
            <JewelleryCard headingLevel="h3" key={piece.slug} piece={piece} />
          ))}
        </div>
      </div>
    </section>
  );
}
