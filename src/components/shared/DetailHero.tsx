import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { HeroImageConfig, HeroOverlayStyle, ProductionImage } from "@/data/assets";

type DetailHeroProps = Partial<HeroImageConfig> & {
  eyebrow: string;
  title: string;
  description: string;
  image?: ProductionImage;
  imageMobile?: ProductionImage;
  imagePosition?: string;
  details?: ReactNode;
};

const imageOverlayClasses: Record<HeroOverlayStyle, string> = {
  light: "hidden",
  dark: "bg-[linear-gradient(0deg,rgba(23,20,17,0.10),transparent_54%)]",
  gradient: "bg-[linear-gradient(0deg,rgba(23,20,17,0.08),transparent_54%)]",
  none: "hidden",
};

export function DetailHero({
  eyebrow,
  title,
  description,
  image,
  imageMobile,
  imagePosition,
  heroImage,
  heroImageMobile,
  heroAlt,
  heroObjectPositionDesktop,
  heroObjectPositionMobile,
  heroOverlayStyle = "none",
  details,
}: DetailHeroProps) {
  const desktopImage = heroImage ?? image;
  if (!desktopImage) return null;

  const mobileImage = heroImageMobile ?? imageMobile ?? desktopImage;
  const desktopPosition = heroObjectPositionDesktop ?? imagePosition;
  const mobilePosition = heroObjectPositionMobile ?? desktopPosition;
  const resolvedAlt = heroAlt ?? title;

  return (
    <section className="grid bg-ivory pt-16 sm:pt-20 md:min-h-[clamp(30rem,58svh,42rem)] md:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:min-h-[clamp(34rem,64svh,48rem)] xl:min-h-[clamp(38rem,72svh,54rem)]">
      <div className="relative aspect-[5/4] min-h-0 overflow-hidden sm:aspect-[16/10] md:aspect-auto">
        <LuxuryImage
          alt={resolvedAlt}
          asset={mobileImage}
          className="absolute inset-0 md:hidden"
          imageClassName="object-cover opacity-100"
          objectPosition={mobilePosition}
          sizes="100vw"
        />
        <LuxuryImage
          alt={resolvedAlt}
          asset={desktopImage}
          className="absolute inset-0 hidden md:block"
          imageClassName="object-cover opacity-100"
          objectPosition={desktopPosition}
          sizes="(min-width: 1280px) 52vw, (min-width: 768px) 54vw, 100vw"
        />
        <div aria-hidden="true" className={twMerge("absolute inset-0", imageOverlayClasses[heroOverlayStyle])} />
      </div>
      <div className="flex items-center px-5 py-12 sm:px-8 sm:py-14 md:py-12 lg:px-12 xl:px-16 xl:py-16">
        <div className="max-w-[39rem]">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-charcoal/50">{eyebrow}</p>
          <h1 className="mt-5 font-serif text-[var(--text-fluid-detail)] font-normal leading-[1.05] tracking-[-0.01em]">{title}</h1>
          <p className="mt-6 text-[0.95rem] leading-[1.8] text-charcoal/68">{description}</p>
          {details ? <div className="mt-8 border-t border-soft-border pt-7 md:mt-9">{details}</div> : null}
        </div>
      </div>
    </section>
  );
}
