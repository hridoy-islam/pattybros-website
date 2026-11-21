"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainAction } from "@/lib/site";

// Phones only: a booking button fixed at the bottom once the visitor has scrolled past the top of the page.
export default function ActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 700;
      setShow(window.scrollY > 600 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory px-6 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <Link href={mainAction.href} tabIndex={show ? 0 : -1} className="btn-primary w-full">
        {mainAction.label}
      </Link>
    </div>
  );
}
