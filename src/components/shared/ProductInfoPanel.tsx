import Link from "next/link";

import type { JewelleryPiece } from "@/data/jewellery";

export function ProductInfoPanel({ piece }: { piece: JewelleryPiece }) {
  return (
    <aside className="border border-soft-border bg-porcelain/76 p-5 shadow-[0_24px_70px_rgb(23_20_17_/_0.045)] sm:p-7 lg:p-9">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-charcoal/48">
        {piece.collectionName} · {piece.category}
      </p>
      <h1 className="mt-5 font-serif text-[clamp(2.25rem,4.5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.015em]">
        {piece.name}
      </h1>
      <p className="mt-6 text-[1rem] leading-[1.85] text-charcoal/70">{piece.shortDescription}</p>
      <div className="mt-8 grid gap-5 border-y border-soft-border py-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div>
          <p className="text-[0.58rem] uppercase tracking-[0.2em] text-charcoal/42">Price</p>
          <p className="mt-2 text-sm tracking-[0.04em]">{piece.priceLabel}</p>
        </div>
        <div>
          <p className="text-[0.58rem] uppercase tracking-[0.2em] text-charcoal/42">Availability</p>
          <p className="mt-2 text-sm leading-6">{piece.availability}</p>
        </div>
        <div>
          <p className="text-[0.58rem] uppercase tracking-[0.2em] text-charcoal/42">Reference</p>
          <p className="mt-2 text-sm tracking-[0.08em]">{piece.referenceCode}</p>
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          className="form-action inline-flex min-h-12 items-center justify-center border border-charcoal bg-charcoal px-7 text-center text-[0.68rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-transparent hover:text-charcoal"
          href={`/contact?subject=${encodeURIComponent(piece.inquirySubject)}`}
        >
          Enquire About This Creation
        </Link>
        <Link
          className="form-action inline-flex min-h-12 items-center justify-center border border-champagne/70 px-7 text-center text-[0.68rem] uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-charcoal"
          href="/appointment"
        >
          Book a Private Appointment
        </Link>
      </div>
      <ul className="mt-8 grid gap-3 border-t border-soft-border pt-7 text-sm leading-6 text-charcoal/68 sm:grid-cols-2">
        {piece.highlights.map((highlight) => (
          <li className="flex gap-3" key={highlight}>
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
            {highlight}
          </li>
        ))}
      </ul>
    </aside>
  );
}
