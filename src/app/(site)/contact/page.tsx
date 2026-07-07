import Link from "next/link";
import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/ContactForm";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata("Contact the Maison", "Contact Aurelia Gems for jewellery, gemstone, bespoke, appointment, and salon enquiries.", "/contact");

const salons = [
  {
    city: "Dubai, United Arab Emirates",
    address: "Dubai Design District, Dubai, United Arab Emirates",
    services: "Private viewings by appointment · Gemstone sourcing consultations · Bespoke jewellery appointments",
  },
  {
    city: "Geneva, Switzerland",
    address: "Rue du Rhône, Geneva, Switzerland",
    services: "Private viewings by appointment · Gemstone sourcing consultations · Bespoke jewellery appointments",
  },
] as const;

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact the Maison" title="We Are Here to Guide You" description="Speak with our team about a creation, private appointment, gemstone, or bespoke commission." {...pageHeroConfigs.contact} />
      <section className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(16rem,0.82fr)_minmax(0,1.18fr)] md:items-start md:gap-12 lg:gap-16 xl:gap-20">
          <div className="md:sticky md:top-28">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Maison Contacts</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">A Personal Response</h2>
            <dl className="mt-8 space-y-5 border-y border-soft-border py-7 text-sm">
              <div>
                <dt className="text-charcoal/45">Email</dt>
                <dd className="mt-1 text-[0.95rem]">aureliagemsinfo@gmail.com</dd>
              </div>
              <div>
                <dt className="text-charcoal/45">Telephone</dt>
                <dd className="mt-1 text-[0.95rem]">+41-785-557-883</dd>
              </div>
            </dl>
            <h3 className="mt-10 font-serif text-xl font-normal">Private Salons</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem] text-charcoal/64">
              {salons.map((salon) => (
                <li key={salon.city}>
                  <p className="text-charcoal/78">{salon.city}</p>
                  <p className="mt-1 text-sm leading-6">{salon.address}</p>
                  <p className="mt-1 text-sm leading-6">{salon.services}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.7rem] uppercase tracking-[0.2em]">
              <Link className="luxury-link" href="/appointment">Book Appointment</Link>
              <Link className="luxury-link" href="/bespoke">Bespoke Services</Link>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
