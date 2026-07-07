import type { JewelleryPiece } from "@/data/jewellery";

export function ProductSpecifications({ piece }: { piece: JewelleryPiece }) {
  const specifications = [
    ["Metal", piece.metal],
    ["Total Carat Weight", piece.totalCaratWeight],
    ["Dimensions", piece.dimensions],
    ["Craftsmanship", piece.craftsmanship],
    ["Certificate", piece.certificateDetails],
    ["Care", piece.careInstructions],
  ] as const;

  return (
    <section className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:gap-14">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Product Details</p>
          <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.08]">
            Materials, making, and care
          </h2>
        </div>
        <dl className="grid border-t border-soft-border sm:grid-cols-2">
          {specifications.map(([label, value]) => (
            <div className="border-b border-soft-border py-6 sm:odd:pr-8 sm:even:border-l sm:even:pl-8" key={label}>
              <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-charcoal/42">{label}</dt>
              <dd className="mt-3 text-sm leading-7 text-charcoal/70">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
