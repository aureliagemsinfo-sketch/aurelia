import { twMerge } from "tailwind-merge";

import { LuxuryImage } from "@/components/shared/LuxuryImage";
import type { HeroImageConfig, HeroOverlayStyle, HeroTheme, ProductionImage } from "@/data/assets";

type PageHeroProps = Partial<HeroImageConfig> & {
  eyebrow: string;
  title: string;
  description: string;
  image?: ProductionImage;
  imageMobile?: ProductionImage;
  imagePosition?: string;
};

const overlayClasses: Record<HeroOverlayStyle, string> = {
  light:
    "bg-[linear-gradient(90deg,rgba(255,253,248,0.74)_0%,rgba(255,253,248,0.46)_30%,rgba(255,253,248,0.14)_54%,transparent_76%)]",
  dark:
    "bg-[linear-gradient(90deg,rgba(23,20,17,0.58)_0%,rgba(23,20,17,0.26)_38%,rgba(23,20,17,0.06)_62%,transparent_78%)]",
  gradient:
    "bg-[linear-gradient(90deg,rgba(23,20,17,0.50)_0%,rgba(23,20,17,0.18)_42%,rgba(255,253,248,0.06)_62%,transparent_78%)]",
  none: "hidden",
};

const themeClasses: Record<HeroTheme, { eyebrow: string; heading: string; paragraph: string; section: string }> = {
  "dark-text": {
    section: "text-charcoal",
    eyebrow: "text-charcoal/55",
    heading: "text-charcoal",
    paragraph: "text-charcoal/70",
  },
  "light-text": {
    section: "text-ivory",
    eyebrow: "text-ivory/70",
    heading: "text-ivory",
    paragraph: "text-ivory/78",
  },
};

export function PageHero({
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
  heroOverlayStyle = "light",
  heroTheme = "dark-text",
}: PageHeroProps) {
  const desktopImage = heroImage ?? image;
  if (!desktopImage) return null;

  const mobileImage = heroImageMobile ?? imageMobile ?? desktopImage;
  const desktopPosition = heroObjectPositionDesktop ?? imagePosition;
  const mobilePosition = heroObjectPositionMobile ?? desktopPosition;
  const resolvedAlt = heroAlt ?? title;
  const theme = themeClasses[heroTheme];

  return (
    <section
      className={twMerge(
        "relative flex min-h-[clamp(27rem,58svh,40rem)] items-end overflow-hidden bg-porcelain px-5 pb-12 pt-28 sm:min-h-[clamp(28rem,54svh,38rem)] sm:px-10 sm:pb-14 md:min-h-[clamp(30rem,56svh,42rem)] lg:px-16 xl:min-h-[clamp(34rem,64svh,46rem)] xl:pb-[4.5rem]",
        theme.section,
      )}
    >
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
        sizes="100vw"
      />
      <div aria-hidden="true" className={twMerge("absolute inset-0", overlayClasses[heroOverlayStyle])} />
      <div className="relative z-10 max-w-[min(42rem,92vw)] md:max-w-2xl lg:max-w-3xl">
        <p className={twMerge("mb-5 text-[0.63rem] uppercase tracking-[0.32em]", theme.eyebrow)}>{eyebrow}</p>
        <h1 className={twMerge("font-serif text-[var(--text-fluid-hero)] font-normal leading-[1.1] tracking-[-0.015em]", theme.heading)}>{title}</h1>
        <p className={twMerge("mt-6 max-w-2xl text-[0.95rem] leading-[1.8]", theme.paragraph)}>{description}</p>
      </div>
    </section>
  );
}
