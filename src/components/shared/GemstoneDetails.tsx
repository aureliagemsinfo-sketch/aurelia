import type { JewelleryPiece } from "@/data/jewellery";

export function GemstoneDetails({ piece }: { piece: JewelleryPiece }) {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Gemstone Profile</p>
          <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal leading-[1.08]">
            Stones selected for colour and character
          </h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {piece.gemstones.map((gemstone) => {
            const rows = [
              ["Gemstone", gemstone.name],
              ["Origin", gemstone.origin],
              ["Cut", gemstone.cut],
              ["Carat", gemstone.carat],
              ["Colour", gemstone.color],
              ["Clarity", gemstone.clarity],
              ["Treatment", gemstone.treatment],
              ["Setting", gemstone.setting],
            ] as const;

            return (
              <article className="border border-soft-border bg-porcelain/74 p-5 sm:p-7" key={`${gemstone.name}-${gemstone.carat}`}>
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-champagne">{gemstone.type}</p>
                <h3 className="mt-3 font-serif text-[clamp(1.4rem,2vw,2rem)] font-normal">{gemstone.name}</h3>
                <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {rows.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[0.56rem] uppercase tracking-[0.18em] text-charcoal/42">{label}</dt>
                      <dd className="mt-2 text-sm leading-6 text-charcoal/70">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
