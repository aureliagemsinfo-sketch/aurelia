"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  primaryNavigation,
  utilityNavigation,
  type NavigationItem,
} from "@/data/navigation";

type MaisonMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MaisonMenuDrawer({ open, onClose }: MaisonMenuDrawerProps) {
  const [activeItem, setActiveItem] = useState<NavigationItem | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const closeDrawer = useCallback(() => {
    setActiveItem(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousFocus?.focus();
    };
  }, [closeDrawer, open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close navigation menu"
            className="fixed inset-0 z-[60] cursor-default bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: "easeOut" }}
            onClick={closeDrawer}
            type="button"
          />
          <motion.div
            ref={panelRef}
            id="maison-menu"
            aria-label="Maison navigation"
            aria-modal="true"
            className="fixed inset-y-0 left-0 z-[70] flex h-[100dvh] w-full max-w-none flex-col overflow-hidden bg-ivory text-charcoal shadow-[18px_0_60px_rgba(0,0,0,0.12)] sm:max-w-[420px]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="dialog"
          >
            <div className="drawer-header flex min-h-16 shrink-0 items-center border-b border-soft-border px-6 sm:min-h-20 sm:px-9">
              <button
                ref={closeButtonRef}
                className="flex min-h-11 items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em]"
                onClick={closeDrawer}
                type="button"
              >
                <X aria-hidden="true" size={15} strokeWidth={1.2} />
                Close
              </button>
            </div>

            <div className="luxury-scrollbar flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-9 sm:py-9">
              <AnimatePresence initial={false} mode="wait">
                {activeItem?.children ? (
                  <motion.nav
                    key={activeItem.label}
                    aria-label={`${activeItem.label} submenu`}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
                  >
                    <button
                      className="mb-9 flex min-h-11 items-center gap-3 text-[0.68rem] uppercase tracking-[0.22em]"
                      onClick={() => setActiveItem(null)}
                      type="button"
                    >
                      <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.2} />
                      Back
                    </button>
                    <p className="border-b border-soft-border pb-5 font-serif text-[clamp(1.35rem,2vw,1.85rem)]">
                      {activeItem.label}
                    </p>
                    <ul className="divide-y divide-soft-border/80">
                      {activeItem.children.map((child) => (
                        <li key={`${child.label}-${child.href}`}>
                          <Link
                            className="flex min-h-14 items-center justify-between py-3 text-sm tracking-[0.04em] transition-opacity hover:opacity-55"
                            href={child.href}
                            onClick={closeDrawer}
                          >
                            {child.label}
                            <ChevronRight aria-hidden="true" size={14} strokeWidth={1.1} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.nav>
                ) : (
                  <motion.div
                    key="primary"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
                  >
                    <nav aria-label="Primary navigation">
                      <ul className="space-y-0.5">
                        {primaryNavigation.map((item) => (
                          <li key={item.label}>
                            {item.children ? (
                              <button
                                className="group flex min-h-11 w-full items-center justify-between py-3 text-left text-[0.92rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-55"
                                onClick={() => setActiveItem(item)}
                                type="button"
                              >
                                {item.label}
                                <ChevronRight
                                  aria-hidden="true"
                                  className="transition-transform group-hover:translate-x-1"
                                  size={14}
                                  strokeWidth={1.1}
                                />
                              </button>
                            ) : (
                              <Link
                                className="flex min-h-11 items-center py-3 text-[0.92rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-55"
                                href={item.href}
                                onClick={closeDrawer}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <nav
                      aria-label="Utility navigation"
                      className="mt-10 border-t border-soft-border pt-7"
                    >
                      <ul className="space-y-1">
                        {utilityNavigation.map((item) => (
                          <li key={`${item.label}-${item.href}`}>
                            <Link
                              className="flex min-h-10 items-center justify-between py-1.5 text-[0.72rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-55"
                              href={item.href}
                              onClick={closeDrawer}
                            >
                              {item.label}
                              <ChevronRight aria-hidden="true" size={12} strokeWidth={1.1} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
