"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainAction, navLinks, hours, site } from "@/lib/site";

// The links on the left, the logo in the middle, the booking button on the right.
// On a phone the menu opens a full-screen sheet.
export default function Header({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ivory">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="container grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">
        {/* left: links (desktop) */}
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current === l.href ? "page" : undefined}
              className="text-[15px] font-medium transition-colors hover:text-primary-dark aria-[current=page]:text-primary-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* centre: logo */}
        <Link href="/" className="col-start-1 flex items-center gap-3 justify-self-start lg:col-start-2 lg:justify-self-center">
          <img src="/logo-256.png" alt="" className="h-10 w-10 md:h-[52px] md:w-[52px]" />
          <span className="font-display text-xl md:text-2xl">LashesByZee</span>
        </Link>

        {/* right: booking button, menu button */}
        <div className="col-start-3 flex items-center justify-end gap-3">
          <Link href={mainAction.href} className="btn-primary hidden h-11 px-6 sm:inline-flex">
            {mainAction.label}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center border border-ink/20 transition-colors hover:border-primary hover:bg-primary lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* phone and tablet menu */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-ivory px-6 pb-8 md:top-[72px] lg:hidden"
        >
          <nav aria-label="Menu" className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...navLinks].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center border-b border-line font-display text-2xl transition-colors hover:text-primary-dark"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={mainAction.href} onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
            {mainAction.label}
          </Link>
          <div className="mt-auto pt-8 text-[15px]">
            <p className="font-medium">
              {site.areaLine}, {site.area}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt>{h.label}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </header>
  );
}
