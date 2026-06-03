"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
  title: string; // Pass "Contact Us", "Our Menu", etc.
  subtitle?: string; // Optional text fallback
  badgeText?: string; // Retained if needed for structure
}

export function Hero({ title, subtitle, badgeText }: HeroProps) {
  const secondaryBreadcrumb = title || "Contact Us";

  return (
<section className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center overflow-hidden bg-white text-white border-none">
      {/* ==================== BACKGROUND IMAGE LAYER ==================== */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/hero1.jpg" // Your background food/restaurant texture asset
          alt={title}
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />
        {/* Exact Red Branding Mask Filter (Matches image_5582ca.jpg perfectly) */}
       <div className="absolute inset-0 bg-red-700/80" />
      </div>

      {/* ==================== CENTERED INNER CONTENT ==================== */}
      <div className="container relative z-10 mx-auto  text-center mt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-2"
        >
          {/* Main Title Block - Extra Compressed, Tall and Bold Uppercase */}
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white  scale-y-110 select-none">
            {title}
          </h1>

          {/* Micro Breadcrumb Navigation Bar */}
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-white/90 pt-1">
            <Link
              href="/"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              <h2>Home</h2>
            </Link>

            {/* The Specific Gold/Amber Divider Dash from Mockup */}
            <span className="text-amber-400 font-black">—</span>

            <span className="text-white">
              <h2>{secondaryBreadcrumb}</h2>
            </span>
          </div>
        </motion.div>
      </div>
<div className="absolute -bottom-3 md:bottom-0 left-0 right-0 z-40 pointer-events-none w-full overflow-hidden">
  <svg
    viewBox="0 0 1440 160"
    fill="none"
    className="w-full h-[60px] md:h-[80px] block"
    preserveAspectRatio="none"
  >
    <path
      d="M0,90 Q360,150 720,110 T1440,70 L1440,161 L0,161 Z"
      fill="rgba(255, 255, 255, 0.25)"
    />
    <path
      d="M0,120 Q360,160 720,135 T1440,100 L1440,161 L0,161 Z"
      fill="#ffffff"
    />
  </svg>
</div>
      
    </section>
  );
}
