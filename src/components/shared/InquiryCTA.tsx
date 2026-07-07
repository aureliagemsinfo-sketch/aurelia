import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { ItemEnquiryForm } from "@/components/shared/ItemEnquiryForm";

type InquiryCTAProps = {
  title?: string;
  description?: string;
  itemName?: string;
  itemSlug?: string;
  itemType?: "product" | "gemstone" | "collection";
};

export function InquiryCTA({
  title = "A Private Conversation with the Maison",
  description = "Discover a creation, select a rare stone, or begin a bespoke commission with our specialists.",
  itemName,
  itemSlug,
  itemType,
}: InquiryCTAProps) {
  const showItemForm = itemName && itemSlug && itemType;

  return (
    <section className="border-y border-soft-border bg-soft-cream px-5 py-16 text-center sm:px-8 sm:py-[5.5rem] lg:py-24">
      <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/48">Private Services</p>
      <h2 className="mx-auto mt-5 max-w-3xl font-serif text-[var(--text-fluid-section)] font-normal leading-[1.06] tracking-[-0.01em]">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-charcoal/64">{description}</p>
      <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
        <LuxuryButton href="/appointment">Book a Private Viewing</LuxuryButton>
        <LuxuryButton href="/contact">Contact the Maison</LuxuryButton>
      </div>
      {showItemForm ? <ItemEnquiryForm itemName={itemName} itemSlug={itemSlug} itemType={itemType} /> : null}
    </section>
  );
}
