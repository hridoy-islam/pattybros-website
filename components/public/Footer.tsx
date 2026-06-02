"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/utils/site-data";
import { 
  Megaphone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronUp, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin 
} from "lucide-react";

const restaurantNavItems = [
  { label: "Home", href: "/" },
  { label: "Our Menu", href: "/menu" },
  { label: "Reservation", href: "/reservation" },
  { label: "Click & Collect", href: "/takeaway" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 pt-24 overflow-hidden select-none">
      
      {/* Pattern Background Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {/* Diagonal Line Pattern */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff),linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff)] bg-[size:20px_20px] bg-[position:0_0,10px_10px]" />
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Crosshatch Pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(45deg,#fff_0px,#fff_2px,transparent_2px,transparent_8px),repeating-linear-gradient(135deg,#fff_0px,#fff_2px,transparent_2px,transparent_8px)]" />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
      </div>

      <div className="container mx-auto  relative z-10">
        
        {/* ==================== UPPER FEATURE COLUMN INFO GRID ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center pb-20 border-b border-zinc-900">
          
          {/* Column 1: About Restaurant */}
          <div className="flex flex-col items-center space-y-4 group">
            <div className="text-primary transition-transform duration-300 group-hover:scale-110">
              <Megaphone className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.15em]">
              About Restaurant
            </h4>
            <h3 className="text-zinc-400 text-sm max-w-xs leading-relaxed font-medium">
              Enjoy a wonderful food and cafe experience
            </h3>
          </div>

          {/* Column 2: Let's Talk */}
          <div className="flex flex-col items-center space-y-4 group">
            <div className="text-primary transition-transform duration-300 group-hover:scale-110">
              <Mail className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.15em]">
              Let's Talk
            </h4>
            <div className="text-zinc-400 text-sm font-medium space-y-0.5">
              <h4 className="hover:text-primary transition-colors cursor-pointer">{siteConfig.email}</h4>
              <h4 className="hover:text-primary transition-colors cursor-pointer">{siteConfig.phone}</h4>
            </div>
          </div>

          {/* Column 3: Let's Meet */}
          <div className="flex flex-col items-center space-y-4 group">
            <div className="text-primary transition-transform duration-300 group-hover:scale-110">
              <MapPin className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.15em]">
              Let's Meet
            </h4>
            <h4 className="text-zinc-400 text-sm max-w-xs leading-relaxed font-medium">
              {siteConfig.address}
            </h4>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="flex flex-col items-center space-y-4 group">
            <div className="text-primary transition-transform duration-300 group-hover:scale-110">
              <Clock className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.15em]">
              Opening Hours
            </h4>
            <div className="text-zinc-400 text-sm font-medium space-y-0.5">
              <h4>Monday - Sunday</h4>
              <h4 className="text-zinc-300 font-bold">9:00AM to 11:30PM</h4>
            </div>
          </div>

        </div>

        {/* ==================== MIDDLE RESTAURANT NAVIGATION LINK MATRIX ==================== */}
        <div className="py-10 flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-zinc-900/60 text-xs uppercase tracking-[0.2em] font-extrabold">
          {restaurantNavItems.map((nav, index) => (
            <Link 
              key={index} 
              href={nav.href} 
              className="text-zinc-400 hover:text-primary transition-colors duration-200"
            >
              <h2>

              {nav.label}
              </h2>
            </Link>
          ))}
        </div>

        {/* ==================== LOWER SUB-FOOTER CONTROL PANEL ==================== */}
        <div className="py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Center Left Block: Copyright statement */}
          <div className="text-xs uppercase tracking-widest font-bold text-zinc-500 order-2 lg:order-2">
            &copy; Copyright {currentYear} <span className="text-primary font-black">Patty Bro's</span>
          </div>

          {/* Right Block: Core Social Media Icons System */}
          <div className="flex items-center gap-2 order-4 lg:order-4">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Youtube, href: "#" },
              { icon: Linkedin, href: "#" }
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.href}
                className="w-9 h-9 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center rounded-none text-sm border border-zinc-800/40"
              >
                <soc.icon className="w-4 h-4 fill-current stroke-0" />
              </a>
            ))}
          </div>

        </div>

      </div>

      {/* Floating Action Element: Smooth back-to-top trigger button (Primary-Foreground Red) */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-10 right-6 md:right-12 z-50 w-12 h-12 bg-primary-foreground text-white flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:bg-primary-foreground/90 hover:-translate-y-1 group"
        aria-label="Scroll back to top"
      >
        <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      </button>

    </footer>
  );
}