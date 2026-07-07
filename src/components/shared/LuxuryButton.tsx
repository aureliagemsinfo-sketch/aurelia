import type { ReactNode } from "react";
import { clsx } from "clsx";
import Link from "next/link";

type LuxuryButtonProps = {
  children: ReactNode;
  href: string;
  inverse?: boolean;
  className?: string;
};

export function LuxuryButton({
  children,
  href,
  inverse = false,
  className,
}: LuxuryButtonProps) {
  return (
    <Link
      className={clsx(
        "luxury-link inline-flex min-h-10 items-center text-[0.68rem] uppercase tracking-[0.22em]",
        inverse ? "text-ivory" : "text-charcoal",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
