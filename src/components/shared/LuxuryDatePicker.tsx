"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

type LuxuryDatePickerProps = {
  ariaLabel?: string;
  className?: string;
  error?: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
const displayFormatter = new Intl.DateTimeFormat("en", { day: "2-digit", month: "long", year: "numeric" });
const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;
  return parsed;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const firstVisible = new Date(firstDay);
  firstVisible.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisible);
    date.setDate(firstVisible.getDate() + index);
    return date;
  });
}

export function LuxuryDatePicker({
  ariaLabel,
  className,
  error,
  name,
  onChange,
  placeholder,
  value,
}: LuxuryDatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedDate = parseDateValue(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const errorId = error ? `${name}-date-error` : undefined;
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    const nextSelectedDate = parseDateValue(value);
    if (nextSelectedDate) setVisibleMonth(startOfMonth(nextSelectedDate));
  }, [value]);

  const selectedDisplay = selectedDate ? displayFormatter.format(selectedDate) : placeholder;
  const closeCalendar = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeCalendar();
  };

  return (
    <div className={twMerge("relative", className)} onKeyDown={handleKeyDown} ref={rootRef}>
      <input name={name} readOnly type="hidden" value={value} />
      <button
        aria-describedby={errorId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel ?? placeholder}
        className={twMerge(
          "form-control flex items-center justify-between gap-4 text-left text-[0.95rem]",
          error && "border-ruby/55 shadow-[0_1px_0_rgb(161_15_43_/_0.38)]",
        )}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        <span className={selectedDate ? "text-charcoal" : "text-charcoal/46"}>{selectedDisplay}</span>
        <CalendarDays aria-hidden="true" className="shrink-0 text-champagne" size={16} strokeWidth={1.25} />
      </button>
      {open ? (
        <div
          aria-label={`${monthFormatter.format(visibleMonth)} appointment date calendar`}
          className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-30 border border-champagne/45 bg-porcelain p-4 shadow-[0_24px_70px_rgb(23_20_17_/_0.14)]"
          role="dialog"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              aria-label="Previous month"
              className="flex size-9 items-center justify-center border border-champagne/35 text-charcoal transition-colors hover:bg-soft-cream"
              onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={15} strokeWidth={1.25} />
            </button>
            <p className="font-serif text-lg text-charcoal">{monthFormatter.format(visibleMonth)}</p>
            <button
              aria-label="Next month"
              className="flex size-9 items-center justify-center border border-champagne/35 text-charcoal transition-colors hover:bg-soft-cream"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              type="button"
            >
              <ChevronRight aria-hidden="true" size={15} strokeWidth={1.25} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/42">
            {weekdayLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dateValue = toDateValue(date);
              const selected = dateValue === value;
              const muted = date.getMonth() !== visibleMonth.getMonth();

              return (
                <button
                  aria-pressed={selected}
                  className={twMerge(
                    "flex aspect-square items-center justify-center border border-transparent text-sm transition-colors hover:border-champagne/35 hover:bg-ivory",
                    muted && "text-charcoal/32",
                    selected && "border-champagne bg-soft-cream text-charcoal shadow-[inset_0_0_0_1px_rgb(200_164_106_/_0.24)]",
                  )}
                  key={dateValue}
                  onClick={() => {
                    onChange(dateValue);
                    closeCalendar();
                  }}
                  type="button"
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="mt-2 text-[0.68rem] tracking-[0.08em] text-ruby" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
