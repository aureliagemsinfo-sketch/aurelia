import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { ProductionImage } from "@/data/assets";

type LuxuryImageProps = {
  asset: ProductionImage;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fallback?: ReactNode;
  sizes: string;
  preload?: boolean;
  objectPosition?: string;
};

export function LuxuryImage({
  asset,
  alt,
  className,
  imageClassName,
  fallbackClassName,
  fallback,
  sizes,
  preload = false,
  objectPosition,
}: LuxuryImageProps) {
  const fallbackLabel = alt ? `${alt} — editorial artwork placeholder` : undefined;
  const fallbackArtworkClassName = asset.placeholder
    ? `hero-art hero-art-${asset.placeholder}`
    : "hero-art hero-art-neutral";

  return (
    <div className={twMerge("relative isolate overflow-hidden", className)}>
      {asset.available ? (
        <Image
          alt={alt}
          className={twMerge("object-cover", imageClassName)}
          fill
          preload={preload}
          sizes={sizes}
          src={asset.src}
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : (
        <div
          aria-hidden={fallbackLabel ? undefined : true}
          aria-label={fallbackLabel}
          className={twMerge("absolute inset-0", fallbackArtworkClassName, fallbackClassName)}
          data-intended-src={asset.src}
          role={fallbackLabel ? "img" : undefined}
        >
          {fallback}
        </div>
      )}
    </div>
  );
}
