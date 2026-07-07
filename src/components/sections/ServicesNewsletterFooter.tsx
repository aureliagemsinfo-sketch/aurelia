import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { footerLinks, services, socialLinks } from "@/data/home";
import Link from "next/link";

export function ServicesNewsletterFooter() {
  return (
    <footer id="footer" className="bg-white text-charcoal">
      <section aria-label="Maison services" className="grid border-t border-soft-border md:grid-cols-3">
        {services.map((service) => (
          <article
            className="flex min-h-64 flex-col items-center justify-center border-b border-soft-border px-5 py-12 text-center md:min-h-72 md:border-r md:px-5 md:py-10 md:last:border-r-0 xl:px-6 xl:py-14"
            key={service.heading}
          >
            <h2 className="max-w-xs font-serif text-[clamp(1.2rem,1.8vw,1.45rem)] font-normal leading-tight">
              {service.heading}
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-[1.8] text-charcoal/62">
              {service.description}
            </p>
            <LuxuryButton className="mt-5" href={service.href}>
              {service.cta}
            </LuxuryButton>
          </article>
        ))}
      </section>

      <section aria-labelledby="newsletter-heading" className="border-b border-soft-border bg-ivory/35 px-5 py-16 text-center sm:px-6 sm:py-20 xl:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">
            Notes from the Maison
          </p>
          <h2 id="newsletter-heading" className="font-serif text-fluid-section font-normal">
            The Aurelia Gems Newsletter
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-charcoal/62">
            Explore collections, gemstone stories, private events, and savoir-faire
            notes from our maison.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <div className="px-5 py-12 text-center sm:px-6 sm:py-16">
        <Link className="inline-block font-serif text-2xl tracking-[0.08em]" href="/">
          Aurelia Gems
        </Link>
        <nav aria-label="Footer navigation" className="mt-9">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-4">
            {footerLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <Link className="text-[0.6rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-50" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Social links" className="mt-7">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {socialLinks.map((link) => (
              <li key={link}>
                <Link className="text-[0.58rem] uppercase tracking-[0.18em] text-charcoal/58 transition-opacity hover:opacity-50" href="/contact">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 text-[0.58rem] uppercase tracking-[0.18em] text-charcoal/40">
          © 2026 Aurelia Gems · Crafted for moments of lasting light
        </p>
      </div>
    </footer>
  );
}
