type AdminPlaceholderPageProps = {
  description: string;
  title: string;
};

export function AdminPlaceholderPage({ description, title }: AdminPlaceholderPageProps) {
  return (
    <section className="max-w-3xl">
      <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Protected Admin</p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.35rem)] font-normal leading-tight">{title}</h1>
      <p className="mt-5 text-sm leading-7 text-charcoal/64">{description}</p>
      <div className="mt-10 border border-charcoal/10 bg-porcelain/74 p-6 shadow-[0_18px_50px_rgb(23_20_17_/_0.035)]">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/45">Next Phase</p>
        <p className="mt-4 font-serif text-2xl font-normal">CRUD coming in the next phase.</p>
      </div>
    </section>
  );
}
