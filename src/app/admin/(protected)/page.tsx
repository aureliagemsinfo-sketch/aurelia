import Link from "next/link";

const overviewCards = [
  {
    href: "/admin/gemstones",
    label: "Gemstones",
    text: "Manage catalogue records, origins, images, publication status, featured placement, and display order.",
  },
  {
    href: "/admin/collections",
    label: "Collections",
    text: "Manage maison collection stories, related gemstones, featured imagery, publication status, and ordering.",
  },
  {
    href: "/admin/products",
    label: "Jewellery",
    text: "Manage jewellery products, image records, collection assignment, gemstone links, status, and order.",
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    text: "Review gemstone, jewellery, collection, and general contact enquiries, then track response progress.",
  },
  {
    href: "/admin/appointments",
    label: "Appointments",
    text: "Confirm, complete, cancel, or archive private viewing requests from the appointment form.",
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    text: "Review subscriber records and manage active subscription state.",
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
          Use this protected workspace to maintain the Aurelia Gems catalogue, review client
          messages, and keep operational records current.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <Link
            className="group border border-charcoal/10 bg-porcelain/74 p-5 shadow-[0_18px_50px_rgb(23_20_17_/_0.035)] transition hover:border-champagne/42 hover:bg-ivory"
            href={card.href}
            key={card.label}
          >
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/45">Manage</p>
            <h2 className="mt-4 font-serif text-2xl font-normal transition group-hover:text-champagne">
              {card.label}
            </h2>
            <p className="mt-4 text-sm leading-7 text-charcoal/62">{card.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
