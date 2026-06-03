"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

const restaurantNavItems = [
  { label: "Home", href: "/" },
  { label: "Our Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Click & Collect", href: "/takeaway" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Professional UX: Lock body scroll when full-screen menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header 
  className={cn(
    "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
    scrolled 
      ? "bg-white text-slate-900 py-2 border-b-0" 
      : "bg-transparent text-white py-2 border-b border-white/10",
    // ONLY apply the shadow if scrolled AND the mobile menu is CLOSED
    (scrolled && !isOpen) && "shadow-md"
  )}
>
        <div className="mx-auto container flex items-center justify-between">
          
          {/* FIXED: Added z-50 and relative so logo stays above the mobile overlay background */}
          <div className="flex-shrink-0 z-50 relative">
            <Link href="/" className="relative block" onClick={() => setIsOpen(false)}>
              <div className={cn(
                "relative transition-all duration-500",
                scrolled 
                  ? "h-12 w-44 md:h-20 md:w-56" 
                  : "h-16 w-52 md:h-24 md:w-56"
              )}>
                <Image
                  src="/logo.png" 
                  alt="Cafino - Patty Bro's"
                  fill
                  className={cn(
                    "object-contain object-left transition-all duration-500",
                    // FIXED: Logo shouldn't invert if mobile navbar is open (since the background becomes white)
                    (!scrolled && !isOpen) && "brightness-0 invert" 
                  )}
                  priority
                  />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {restaurantNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative font-bold uppercase tracking-[1.5px] transition-colors text-md ",
                  scrolled 
                    ? "text-slate-900 hover:text-primary" 
                    : "text-white hover:text-primary"
                )}
              >
                <h1>{item.label}</h1>
                <span className={cn(
                  "absolute -bottom-2 left-0 h-[2.5px] w-0 transition-all duration-300 group-hover:w-full",
                  scrolled ? "bg-primary/90" : "bg-primary"
                )} />
              </Link>
            ))}
          </nav>

          {/* CTA Actions Block */}
          <div className="flex items-center gap-4">
            <Link href="/reservation" className="hidden md:block">
               <Button 
                 className={cn(
                   "font-extrabold tracking-wider transition-all duration-300 rounded-full",
                   "bg-primary hover:bg-primary/90 text-white",
                   "h-11 px-6 text-md" 
                 )}
               >
                 <h1>BOOK TABLE NOW</h1>
               </Button>
            </Link>

            {/* Mobile Burger Switcher */}
            <button 
              className={cn(
                "lg:hidden p-2 transition-all duration-300 rounded-full z-50 relative",
                (scrolled && !isOpen) ? "text-slate-900 hover:bg-black/5" : "text-white hover:bg-white/10",
                isOpen && "text-slate-900 hover:bg-black/5" 
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 w-full h-screen bg-white z-40 lg:hidden flex flex-col justify-between transition-all duration-500 ease-in-out transform",
          isOpen 
            ? "translate-y-0 opacity-100 visibility-visible" 
            : "-translate-y-full opacity-0 visibility-hidden pointer-events-none"
        )}
      >
        {/* Top Spacer to offset content cleanly under the header logo line */}
        <div className="h-24 flex-shrink-0" />

        {/* Links Middle Container */}
        <div className="flex-grow flex flex-col justify-center items-center px-6">
          <nav className="flex flex-col space-y-6 text-center w-full max-w-sm">
            {restaurantNavItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{ 
                  transitionDelay: isOpen ? `${index * 75}ms` : "0ms" 
                }}
                className={cn(
                  "text-2xl font-extrabold uppercase tracking-widest text-slate-900 transition-all duration-500 hover:text-[#f3b71b]",
                  isOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Call to Action Section */}
        <div 
          className={cn(
            "p-8 w-full max-w-md mx-auto transition-all duration-700 delay-300 pb-12",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link href="/reservation" onClick={() => setIsOpen(false)} className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold tracking-widest text-sm rounded-full py-7 shadow-lg shadow-primary/20">
              BOOK TABLE NOW
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}