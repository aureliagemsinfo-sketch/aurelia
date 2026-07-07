import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { absoluteUrl } from "@/lib/site";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined,
    })),
  };

  return (
    <>
      <SEOJsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-[0.6rem] uppercase tracking-[0.2em] text-charcoal/52">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight aria-hidden="true" size={11} strokeWidth={1.2} /> : null}
              {item.href ? (
                <Link className="transition-opacity hover:opacity-50" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
