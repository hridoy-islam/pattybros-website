"use client";

import { careerContent } from "@/utils/content";
import { motion } from "framer-motion";

export function CareerHero() {
  const { title } = careerContent.hero;
  return (
    <section className="relative pt-32 md:pt-44 pb-12 md:pb-20 bg-slate-50 overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-[12px] font-black uppercase tracking-[2px] mb-6"
          >
            Join the movement
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-none"
          >
            {title}<span className="text-primary">.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-500 font-medium max-w-xl"
          >
            We are looking for visionary thinkers and bold developers to build the digital future with us.
          </motion.p>
        </div>
      </div>
    </section>
  );
}