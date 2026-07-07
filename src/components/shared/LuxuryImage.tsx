"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { LuxuryLoader } from "@/components/shared/LuxuryLoader";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fallbackLabel = alt ? `${alt} - editorial artwork placeholder` : undefined;
  const fallbackArtworkClassName = asset.placeholder
    ? `hero-art hero-art-${asset.placeholder}`
    : "hero-art hero-art-neutral";
  const showFallback = !asset.available || hasError;

  return (
    <div className={twMerge("relative isolate overflow-hidden", className)}>
      {asset.available && !hasError ? (
        <>
          <LuxuryLoader
            className={twMerge(
              "z-0 transition-opacity duration-500",
              isLoaded ? "opacity-0" : "opacity-100",
            )}
            label={`Loading ${alt}`}
            variant="image"
          />
          <Image
            alt={alt}
            className={twMerge(
              "z-10 object-cover opacity-0 transition-opacity duration-700 ease-out",
              isLoaded && "opacity-100",
              imageClassName,
            )}
            fill
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            preload={preload}
            sizes={sizes}
            src={asset.src}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </>
      ) : null}
      {showFallback ? (
        <div
          aria-hidden={fallbackLabel ? undefined : true}
          aria-label={fallbackLabel}
          className={twMerge("absolute inset-0", fallbackArtworkClassName, fallbackClassName)}
          data-intended-src={asset.src}
          role={fallbackLabel ? "img" : undefined}
        >
          {fallback}
        </div>
      ) : null}
    </div>
  );
}
