import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function GiftCampaignSection() {
  return (
    <section id="gifts" aria-labelledby="gifts-heading" className="bg-ivory py-14 sm:py-16 xl:py-20">
      <div className="mx-auto mb-10 px-4 text-center">
        <h2
          id="gifts-heading"
          className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.12] text-charcoal tracking-[-0.01em]"
        >
          Enchanting Gifts
        </h2>
      </div>

      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1840px] sm:w-[94vw]">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/8] xl:aspect-[16/7]">
          <LuxuryImage
            alt="Fine jewellery arranged over a luminous water surface"
            asset={homepageImages.gifts}
            className="absolute inset-0 h-full w-full"
            imageClassName="object-cover object-center"
            sizes="(min-width: 1840px) 1840px, (min-width: 640px) 94vw, calc(100vw - 1rem)"
            fallbackClassName="gift-visual"
            fallback={
              <>
                <div aria-hidden="true" className="lily-pad gift-lily-one" />
                <div aria-hidden="true" className="lily-pad gift-lily-two" />
                <div aria-hidden="true" className="gift-gem gift-gem-one"><i /></div>
                <div aria-hidden="true" className="gift-gem gift-gem-two"><i /></div>
              </>
            }
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-12 text-center sm:pt-16">
        <p className="font-sans text-[0.95rem] md:text-[1rem] leading-[1.8] text-charcoal/70">
          Mark life’s meaningful moments with jewels chosen for brilliance,
          symbolism, and lasting beauty.
        </p>
        <LuxuryButton className="mt-6" href="/collections">
          Enter the Timeless Universe
        </LuxuryButton>
      </div>
    </section>
  );
}
