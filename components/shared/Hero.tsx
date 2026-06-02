"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  badgeText?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
}

export function Hero({
  badgeText = "", // Default fallback
  title,
  subtitle,
  buttonText = "Contact Us",
  buttonHref = "/contact",
}: HeroProps) {
  return (
<section className="relative pt-44 md:pt-52 pb-24 md:pb-32 bg-secondary text-center overflow-hidden border-0">
      
      {/* --- BACKGROUND EFFECTS (From Cta) --- */}
      
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* 2. Center Glow Pulse (Converted to Framer Motion) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/40 blur-[120px] rounded-full pointer-events-none" 
      />

      {/* --- CONTENT --- */}
      <div className="container relative z-10 ">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          
          {/* Badge / Pill */}
          {badgeText && (
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              {badgeText}
            </div>
          )}

          {/* Title with Gradient (Swapped to h1 for SEO) */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 leading-[1.1]">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-2xl font-medium text-white mb-10 max-w-4xl leading-relaxed mx-auto">
            {subtitle}
          </p>
          
          {/* Button Group */}
          {buttonText && buttonHref && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Added 'group' for the arrow hover effect */}
              <Link href={buttonHref} className="group inline-block">
                <Button size="xl">
                  {buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}

        </motion.div>
      </div>

      {/* --- BOTTOM SVG WAVE (From AboutHero) --- */}
<div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="block w-full h-[60px] md:h-[100px] fill-background"
        >
          <path d="M0,0 C300,130 900,130 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>

    </section>
  );
}