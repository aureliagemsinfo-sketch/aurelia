const overviewCards = [
  {
    label: "Gemstones",
    text: "Prepare gemstone records, origins, story notes, and published status in the next CRUD phase.",
  },
  {
    label: "Collections",
    text: "Manage maison collection stories, imagery, and featured jewellery relationships later.",
  },
  {
    label: "Jewellery",
    text: "Product creation, image ordering, gemstone links, and related pieces will arrive next.",
  },
  {
    label: "Enquiries",
    text: "Contact and product enquiry triage will be wired after the content CRUD screens.",
  },
  {
    label: "Appointments",
    text: "Appointment requests will use this protected area once the workflow is implemented.",
  },
  {
    label: "Newsletter",
    text: "Subscriber review and export controls are planned for a later admin phase.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <section className="max-w-4xl">
        <p className="text-[0.64rem] uppercase tracking-[0.24em] text-charcoal/45">Admin Dashboard</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.4rem)] font-normal leading-tight">
          Operations overview
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal/64">
          The protected admin foundation is active. This shell is intentionally minimal until the
          gemstone, collection, and jewellery CRUD phases begin.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <article className="border border-charcoal/10 bg-porcelain/74 p-5 shadow-[0_18px_50px_rgb(23_20_17_/_0.035)]" key={card.label}>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/45">Coming Next</p>
            <h2 className="mt-4 font-serif text-2xl font-normal">{card.label}</h2>
            <p className="mt-4 text-sm leading-7 text-charcoal/62">{card.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
