import { LuxuryButton } from "@/components/shared/LuxuryButton";
import { LuxuryImage } from "@/components/shared/LuxuryImage";
import { homepageImages } from "@/data/assets";

export function ProductModelSplitSection() {
  return (
    <section
      id="liora"
      aria-labelledby="liora-heading"
      className="grid bg-porcelain sm:min-h-[var(--section-tablet-height)] sm:grid-cols-2 xl:min-h-[var(--section-desktop-height)]"
    >
      <div className="flex min-h-[34rem] flex-col items-center justify-center bg-[linear-gradient(145deg,#fffdf8_0%,#fbf4ea_52%,#f1e2cc_100%)] px-6 py-12 text-center sm:min-h-0 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="flex w-full max-w-[35rem] flex-col items-center">
          <LuxuryImage
            alt="Liora Blossom ring in yellow gold, diamond, and citrine"
            asset={homepageImages.ring}
            className="mb-5 aspect-[1.18] w-full max-w-[22rem] bg-[radial-gradient(ellipse_at_50%_56%,rgba(200,164,106,0.2)_0%,rgba(255,253,248,0.86)_43%,rgba(255,253,248,0)_72%)] sm:mb-6 sm:max-w-[26rem] lg:max-w-[30rem] xl:max-w-[34rem]"
            fallbackClassName="product-fallback flex items-center justify-center"
            imageClassName="object-cover object-center scale-[1.1] brightness-[1.02] contrast-[1.03] saturate-[1.04]"
            sizes="(min-width: 1280px) 544px, (min-width: 1024px) 480px, (min-width: 640px) 416px, 352px"
            fallback={
              <div aria-hidden="true" className="ring-still-life">
                <span className="ring-band" />
                <span className="ring-stone" />
                <span className="ring-halo" />
              </div>
            }
          />
          <p className="mb-3 text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/52">
            Aurelia Botanical Series
          </p>
          <h2 id="liora-heading" className="font-serif text-[clamp(1.55rem,2.15vw,2.15rem)] font-normal leading-tight">
            Liora Blossom Ring
          </h2>
          <p className="mt-3 text-[0.72rem] uppercase tracking-[0.17em] text-charcoal/58">
            Yellow Gold, Diamond, Citrine
          </p>
          <LuxuryButton className="mt-7" href="/jewellery">
            More Creations
          </LuxuryButton>
        </div>
      </div>

      <div className="relative min-h-[60svh] overflow-hidden bg-dark-teal sm:min-h-0">
        <LuxuryImage
          alt="Model wearing an Aurelia gemstone creation"
          asset={homepageImages.modelJewellery}
          className="absolute inset-0"
          fallbackClassName="model-editorial"
          imageClassName="object-[74%_center] brightness-[1.06] contrast-[1.04] saturate-[1.04] sm:object-[74%_center] lg:object-[73%_center] xl:object-[72%_center]"
          sizes="(min-width: 640px) 50vw, 100vw"
          fallback={
            <>
              <div aria-hidden="true" className="editorial-arch" />
              <div aria-hidden="true" className="editorial-figure">
                <span className="figure-head" />
                <span className="figure-neck" />
                <span className="figure-dress" />
                <span className="figure-jewel" />
              </div>
            </>
          }
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(23,20,17,0.12)_0%,rgba(23,20,17,0)_28%)]" />
        <p className="absolute bottom-6 right-6 text-[0.58rem] uppercase tracking-[0.25em] text-white/78">
          Portrait in Cobalt
        </p>
      </div>
    </section>
  );
}
