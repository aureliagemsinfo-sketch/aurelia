"use client";

import { MapPin, Menu, Phone, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

import { MaisonMenuDrawer } from "@/components/layout/MaisonMenuDrawer";
import { getHeaderConfig } from "@/data/header";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const config = getHeaderConfig(pathname);

  return (
    <>
      <header
        className={clsx(
          "site-header fixed inset-x-0 top-0 z-50 flex h-16 md:h-[88px] lg:h-[96px] items-center justify-between px-4 transition-[background-color,color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 lg:px-12",
          scrolled
            ? "border-b border-[#e8ded0] bg-[#fbf7ef]/98 text-[#171411] backdrop-blur-md"
            : config.topTheme === "dark-media"
              ? "border-b border-transparent bg-gradient-to-b from-black/20 to-transparent text-white"
              : "border-b border-transparent bg-transparent text-[#171411]",
        )}
      >
        {/* Left Column: Menu and Search */}
        <div className="flex items-center gap-6">
          <button
            aria-expanded={menuOpen}
            aria-controls="maison-menu"
            aria-label="Open maison navigation"
            className="flex min-h-11 items-center gap-2.5 text-[0.7rem] font-sans uppercase tracking-[0.18em] opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" size={17} strokeWidth={1.25} />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <Link
            aria-label="View collections"
            className="hidden lg:flex min-h-11 items-center gap-2.5 text-[0.7rem] font-sans uppercase tracking-[0.18em] opacity-85 hover:opacity-100 transition-opacity"
            href="/collections"
          >
            <Search aria-hidden="true" size={17} strokeWidth={1.25} />
            <span className="hidden xl:inline">Collections</span>
          </Link>
        </div>

        {/* Center Wordmark (Absolutely centered in the viewport) */}
        <Link
          aria-label="Aurelia Gems home"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(1.35rem,5vw,1.75rem)] md:text-[clamp(1.65rem,2.2vw,2.25rem)] lg:text-[clamp(1.9rem,2.4vw,2.65rem)] font-normal tracking-[0.03em] whitespace-nowrap"
          href="/"
        >
          Aurelia Gems
        </Link>

        {/* Right Column: Location and Contact */}
        <nav aria-label="Header utilities" className="flex items-center gap-4 sm:gap-6">
          <Link
            aria-label="Find a private salon"
            className="header-utility hidden sm:inline-flex opacity-85 hover:opacity-100 transition-opacity"
            href="/appointment"
          >
            <MapPin aria-hidden="true" size={17} strokeWidth={1.25} />
          </Link>
          <Link
            aria-label="Contact us"
            className="header-utility hidden md:inline-flex opacity-85 hover:opacity-100 transition-opacity"
            href="/contact"
          >
            <Phone aria-hidden="true" size={16} strokeWidth={1.25} />
          </Link>
        </nav>
      </header>

      <MaisonMenuDrawer open={menuOpen} onClose={closeMenu} />
    </>
  );
}
