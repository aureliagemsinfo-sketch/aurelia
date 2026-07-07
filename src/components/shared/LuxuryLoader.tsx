import { twMerge } from "tailwind-merge";

type LuxuryLoaderVariant = "page" | "image" | "video" | "card";

type LuxuryLoaderProps = {
  variant?: LuxuryLoaderVariant;
  className?: string;
  decorative?: boolean;
  label?: string;
};

const variantClasses: Record<LuxuryLoaderVariant, string> = {
  page: "min-h-[44svh] bg-ivory",
  image: "absolute inset-0",
  video: "absolute inset-0",
  card: "min-h-48",
};

export function LuxuryLoader({
  variant = "image",
  className,
  decorative = variant !== "page",
  label = "Loading",
}: LuxuryLoaderProps) {
  const isPage = variant === "page";

  return (
    <div
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      aria-live={!decorative && isPage ? "polite" : undefined}
      className={twMerge(
        "luxury-loader relative isolate flex overflow-hidden border border-champagne/12 bg-[linear-gradient(135deg,rgb(255_253_248_/_0.96),rgb(246_236_221_/_0.86)_46%,rgb(255_250_241_/_0.94))]",
        isPage ? "items-center justify-center px-5 py-20" : "items-center justify-center",
        variantClasses[variant],
        className,
      )}
      role={decorative ? undefined : isPage ? "status" : "img"}
    >
      <span aria-hidden="true" className="luxury-loader__sheen" />
      <span aria-hidden="true" className="luxury-loader__aura" />
      <span
        aria-hidden="true"
        className={twMerge(
          "relative z-10 rounded-full border border-champagne/36 bg-porcelain/56 shadow-[0_18px_48px_rgb(200_164_106_/_0.16)]",
          isPage ? "h-12 w-12" : "h-8 w-8",
        )}
      >
        <span className="absolute inset-[34%] rounded-full bg-champagne/72 shadow-[0_0_18px_rgb(200_164_106_/_0.36)]" />
      </span>
      {isPage ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
