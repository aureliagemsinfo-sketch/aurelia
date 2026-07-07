import type { Metadata } from "next";

import { AppointmentForm } from "@/components/shared/AppointmentForm";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroConfigs } from "@/data/assets";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata("Book a Private Appointment", "Request a private jewellery, gemstone, bridal, bespoke, or care consultation with Aurelia Gems.", "/appointment");

export default function AppointmentPage() {
  return (
    <main>
      <PageHero eyebrow="Private Appointments" title="Time Reserved for Your Story" description="Meet with a maison specialist in one of our salons or through a private virtual consultation." {...pageHeroConfigs.appointment} />
      <section className="bg-ivory px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]">
        <div className="mx-auto grid max-w-6xl gap-9 md:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] md:items-start md:gap-10 lg:gap-14 xl:gap-[4.5rem]">
          <div className="md:sticky md:top-28">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Your Visit</p>
            <h2 className="mt-5 font-serif text-[var(--text-fluid-section)] font-normal">Request an Appointment</h2>
            <p className="mt-5 text-[0.95rem] leading-[1.8] text-charcoal/64">Share a few details and our maison team will prepare a considered conversation around your interests.</p>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </main>
  );
}
