import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const controlBase =
  "h-9 border border-champagne/28 bg-ivory/80 text-sm text-charcoal shadow-[0_1px_0_rgb(255_255_255_/_0.72)_inset] transition focus-visible:border-champagne focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/45";

export function AdminSelect({ className, style, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      {...props}
      className={twMerge(
        controlBase,
        "min-w-36 appearance-none px-3 pr-8 capitalize",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(45deg, transparent 50%, rgb(23 20 17 / 0.58) 50%), linear-gradient(135deg, rgb(23 20 17 / 0.58) 50%, transparent 50%)",
        backgroundPosition: "calc(100% - 16px) 50%, calc(100% - 11px) 50%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "5px 5px, 5px 5px",
        ...style,
      }}
    />
  );
}

export function AdminNumberInput({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={twMerge(controlBase, "w-20 px-3 tabular-nums", className)}
      type="number"
    />
  );
}

export function AdminSubmitButton({ className, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={twMerge(
        "inline-flex h-9 items-center justify-center border border-champagne/32 bg-porcelain/76 px-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-charcoal/64 transition hover:border-charcoal/28 hover:bg-ivory hover:text-charcoal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/45",
        className,
      )}
      type={props.type ?? "submit"}
    />
  );
}

export function AdminInlineForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  return <form {...props} className={twMerge("flex items-center gap-2", className)} />;
}
