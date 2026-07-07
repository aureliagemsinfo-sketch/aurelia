"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

type LuxurySelectOption = {
  label: string;
  value: string;
};

type LuxurySelectProps = {
  ariaLabel?: string;
  className?: string;
  error?: string;
  name: string;
  onChange: (value: string) => void;
  options: LuxurySelectOption[];
  placeholder: string;
  required?: boolean;
  value: string;
};

export function LuxurySelect({
  ariaLabel,
  className,
  error,
  name,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: LuxurySelectProps) {
  const listboxId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const defaultActiveIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
  const errorId = error ? `${listboxId}-error` : undefined;
  const requiredId = required ? `${listboxId}-required` : undefined;
  const describedBy = [errorId, requiredId].filter(Boolean).join(" ") || undefined;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const openListbox = () => {
    setActiveIndex(defaultActiveIndex);
    setOpen(true);
  };

  const toggleListbox = () => {
    if (open) {
      setOpen(false);
      return;
    }

    openListbox();
  };

  const selectOption = (index: number) => {
    const nextOption = options[index];
    if (!nextOption) return;
    onChange(nextOption.value);
    setActiveIndex(index);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!options.length) return;
      setOpen(true);
      setActiveIndex((currentIndex) => {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const baseIndex = open ? currentIndex : defaultActiveIndex;
        return (baseIndex + direction + options.length) % options.length;
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        selectOption(activeIndex);
      } else {
        openListbox();
      }
    }
  };

  return (
    <div className={twMerge("relative", className)} ref={rootRef}>
      <input name={name} readOnly type="hidden" value={value} />
      <button
        aria-label={ariaLabel ?? placeholder}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={twMerge(
          "form-control flex items-center justify-between gap-4 text-left text-[0.95rem]",
          error && "border-ruby/55 shadow-[0_1px_0_rgb(161_15_43_/_0.38)]",
        )}
        onClick={toggleListbox}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span className={selectedOption ? "text-charcoal" : "text-charcoal/46"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={twMerge("shrink-0 text-champagne transition-transform duration-300", open && "rotate-180")}
          size={16}
          strokeWidth={1.25}
        />
      </button>
      {open ? (
        <ul
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          className="luxury-scrollbar absolute left-0 right-0 top-[calc(100%+0.55rem)] z-30 max-h-64 overflow-y-auto border border-champagne/45 bg-porcelain py-2 text-[0.9rem] shadow-[0_24px_70px_rgb(23_20_17_/_0.14)]"
          id={listboxId}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;

            return (
              <li
                aria-selected={selected}
                className={twMerge(
                  "cursor-pointer px-4 py-3 text-charcoal transition-colors",
                  active && "bg-soft-cream",
                  selected && "text-charcoal",
                  !selected && "hover:bg-ivory",
                )}
                id={`${listboxId}-${index}`}
                key={option.value}
                onClick={() => selectOption(index)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span className={twMerge("block", selected && "text-champagne")}>{option.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {error ? (
        <p className="mt-2 text-[0.68rem] tracking-[0.08em] text-ruby" id={errorId}>
          {error}
        </p>
      ) : null}
      {required ? (
        <span className="sr-only" id={requiredId}>
          Required
        </span>
      ) : null}
    </div>
  );
}
