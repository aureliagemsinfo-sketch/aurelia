import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Gemstones", href: "/gemstones" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Journal", href: "/journal" },
  { label: "Book an Appointment", href: "/appointment" },
  { label: "Contact Us", href: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-soft-border bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
      <Link className="font-serif text-2xl tracking-[0.08em]" href="/">Aurelia Gems</Link>
      <nav aria-label="Footer navigation" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-x-7 gap-y-4">
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <Link className="text-[0.6rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-50" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-9 text-[0.58rem] uppercase tracking-[0.18em] text-charcoal/40">
        © 2026 Aurelia Gems · Dubai · Switzerland
      </p>
    </footer>
  );
}
