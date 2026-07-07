export type NavigationLink = { label: string; href: string };

export type NavigationItem =
  | { label: string; href: string; children?: never }
  | { label: string; children: readonly NavigationLink[]; href?: never };

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Gemstones", href: "/gemstones" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Journal", href: "/journal" },
];

export const utilityNavigation: readonly NavigationLink[] = [
  { label: "Book an Appointment", href: "/appointment" },
  { label: "Contact Us", href: "/contact" },
];
