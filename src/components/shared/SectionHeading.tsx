import { clsx } from "clsx";

type SectionHeadingProps = {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  align = "center",
  inverse = false,
}: SectionHeadingProps) {
  return (
    <header
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        inverse ? "text-ivory" : "text-charcoal",
      )}
    >
      {eyebrow ? (
        <p className="mb-5 text-[0.68rem] uppercase tracking-[0.3em] opacity-70">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="font-serif text-fluid-section font-normal leading-[1.06] tracking-[-0.02em]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 opacity-[0.72] sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
