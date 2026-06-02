"use client";
import { servicesContent } from "@/utils/content";
import { motion } from "framer-motion";

export function ServicesHero() {
  const { title, subtitle } = servicesContent.hero;
  return (
    <section className="relative pt-44 md:pt-52 pb-24 md:pb-32 bg-primary text-center overflow-hidden">
      <div className="container relative z-10 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-white uppercase"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed text-white font-medium"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Same standard curve used on Hero pages */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px] fill-background">
          <path d="M0,0 C300,130 900,130 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}