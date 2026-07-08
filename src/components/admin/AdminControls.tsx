"use client";

import type { ComponentPropsWithoutRef, KeyboardEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type AdminDropdownOption = {
  label: string;
  value: string;
};

const controlBase =
  "h-9 border border-champagne/28 bg-ivory/80 text-sm text-charcoal shadow-[0_1px_0_rgb(255_255_255_/_0.72)_inset] transition focus-visible:border-champagne focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/45";

export function AdminDropdown({
  className,
  defaultValue,
  disabled = false,
  name,
  onValueChange,
  options,
}: {
  className?: string;
  defaultValue: string;
  disabled?: boolean;
  name: string;
  onValueChange?: (value: string) => void;
  options: AdminDropdownOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function selectValue(value: string) {
    setSelectedValue(value);
    onValueChange?.(value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, value: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectValue(value);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className={twMerge("relative min-w-36", className)}>
      <input name={name} type="hidden" value={selectedValue} />
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        className={twMerge(
          controlBase,
          "flex w-full items-center justify-between gap-3 px-3 text-left capitalize disabled:cursor-not-allowed disabled:opacity-50",
        )}
        disabled={disabled}
        onClick={() => setIsOpen((value) => !value)}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span>{selectedOption?.label ?? selectedValue}</span>
        <span aria-hidden="true" className="text-[0.58rem] text-charcoal/52">
          v
        </span>
      </button>
      {isOpen ? (
        <div
          className="absolute left-0 top-[calc(100%+0.35rem)] z-30 w-full border border-champagne/24 bg-porcelain p-1 shadow-[0_18px_45px_rgb(23_20_17_/_0.12)]"
          id={listboxId}
          ref={listRef}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                aria-selected={isSelected}
                className={twMerge(
                  "block w-full px-3 py-2 text-left text-[0.72rem] capitalize tracking-[0.04em] text-charcoal/68 transition hover:bg-ivory hover:text-charcoal focus-visible:bg-ivory focus-visible:outline-none",
                  isSelected && "bg-ivory text-charcoal",
                )}
                key={option.value}
                onClick={() => selectValue(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, option.value)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
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
