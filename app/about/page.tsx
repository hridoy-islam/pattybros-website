"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Flame, Sparkles, Award, ChefHat, ShieldCheck, Heart } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { aboutContent } from "@/utils/content";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  // Graceful fallback values if content utility isn't fully defined yet
  const title = "Our Story";
  const subtitle = aboutContent?.hero?.subtitle || "Smashed with Passion, Crafted for Purists.";
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <SmoothScroll>
      {/* 1. Header Hero Component */}
      <Hero title={title} subtitle={subtitle} />

      {/* Main Page Layout Wrapper */}
      <div className="bg-white text-zinc-900 overflow-hidden">
        
        <section className="py-20 md:py-28 container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-3 select-none">
                <span className="w-6 h-[2px] bg-primary-foreground" />
                <span className="text-primary-foreground font-black text-xs uppercase tracking-[0.25em]"><h4>The Patty Bro's Way</h4></span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight scale-y-105 origin-left select-none leading-none">
                We Didn't Invent The Burger.<br/>
                <span className="text-primary-foreground">We Just Perfected It.</span>
              </h2>
              
              <h4 className="text-zinc-600 text-sm md:text-base font-medium leading-relaxed pt-2">
                Founded by a brotherhood of culinary purists, Patty Bro’s was born out of absolute frustration with over-complicated, soggy, and uninspired burgers. We went back to basics, obsessing over the physics of the perfect sear and the chemistry of the ultimate melt.
              </h4>
              
              <h4 className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                Every single day, we grind custom cuts of 100% premium, grass-fed Angus beef. We smash them hard onto high-temperature flat-tops to lock in an intensely caramelized crust—the legendary Maillard reaction. Paired with soft, toasted artisanal brioche buns and our tightly guarded secret sauces, this isn’t fast food. It’s precision craft.
              </h4>

              {/* Quick High-End Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-900">100%</h3>
                  <h4 className="text-zinc-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Prime Angus Beef</h4>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-900">Zero</h3>
                  <h4 className="text-zinc-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Frozen Patties</h4>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-900">15+</h3>
                  <h4 className="text-zinc-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5">Secret Spices</h4>
                </div>
              </div>
            </motion.div>

            {/* Right Media Display Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden shadow-2xl bg-zinc-100 border border-zinc-200/40">
                <Image 
                  src="/about-burger.jpg" // Swap with your interior or premium burger preparation asset
                  alt="Crafting the perfect smash burger"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-w: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Floating Absolute Minimalist Badge */}
                <div className="absolute bottom-6 left-6 bg-zinc-950 text-white p-5 rounded-sm flex items-center gap-4 border border-zinc-800 shadow-xl backdrop-blur-md bg-opacity-95">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center text-white shrink-0">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Searing Since</p>
                    <p className="text-base font-extrabold text-white tracking-tight">EST. 2019</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ==================== SECTION B: OUR PILLARS / QUALITY VALUES ==================== */}
        <section className="bg-zinc-50 border-t border-b border-zinc-200/50 py-20 md:py-24">
          <div className="container mx-auto  text-center">
            
            <div className="flex flex-col items-center mb-14 max-w-5xl mx-auto space-y-3">
              <div className="flex items-center gap-3 select-none">
                <span className="w-4 h-[2px] bg-primary-foreground" />
                <span className="text-primary-foreground font-black text-xs uppercase tracking-[0.25em]"><h4>No Compromises</h4></span>
                <span className="w-4 h-[2px] bg-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-zinc-900 scale-y-105">
                The Pillars of Perfection
              </h2>
              <h4 className="text-zinc-500 text-xs md:text-sm font-semibold">
                We maintain an unrelenting, industrial standard across every single tray that leaves our kitchen pass.
              </h4>
            </div>

            {/* Three Pillar Cards Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="bg-white p-8 md:p-10 border border-zinc-200/60 rounded-sm shadow-md shadow-zinc-200/30 flex flex-col items-center text-center group hover:border-zinc-300 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-red-50 text-primary-foreground flex items-center justify-center mb-6 border border-red-100 transition-colors group-hover:bg-primary-foreground group-hover:text-white duration-300">
                  <ChefHat className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-zinc-900 mb-3">
                  Chefs, Not Clerks
                </h3>
                <h4 className="text-zinc-500 text-xs leading-relaxed font-medium">
                  Our crew undergoes weeks of rigorous training on smash geometry, moisture retention, and bun architecture. We handle fire with precision.
                </h4>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white p-8 md:p-10 border border-zinc-200/60 rounded-sm shadow-md shadow-zinc-200/30 flex flex-col items-center text-center group hover:border-zinc-300 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-red-50 text-primary-foreground flex items-center justify-center mb-6 border border-red-100 transition-colors group-hover:bg-primary-foreground group-hover:text-white duration-300">
                  <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-zinc-900 mb-3">
                  Elite Sourcing
                </h3>
                <h4 className="text-zinc-500 text-xs leading-relaxed font-medium">
                  If we can't trace the farm it came from, it doesn't enter our doors. We partner strictly with premium independent, local regenerative farms.
                </h4>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white p-8 md:p-10 border border-zinc-200/60 rounded-sm shadow-md shadow-zinc-200/30 flex flex-col items-center text-center group hover:border-zinc-300 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-red-50 text-primary-foreground flex items-center justify-center mb-6 border border-red-100 transition-colors group-hover:bg-primary-foreground group-hover:text-white duration-300">
                  <Sparkles className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-zinc-900 mb-3">
                  Hyper-Fresh Daily
                </h3>
                <h4 className="text-zinc-500 text-xs leading-relaxed font-medium">
                  We don't hold inventory over. Buns are baked fresh every sunrise, veggies are sliced every morning, and beef is ground hours before service.
                </h4>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ==================== SECTION C: PREMIUM FLUID BRAND CTA ==================== */}
        <section className="relative bg-zinc-950 text-white py-24 md:py-32">
          {/* Subtle Dark Graphic Underlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,33,39,0.12),transparent_70%)] pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-[0.2em] text-amber-400 select-none">
                <Award className="w-3.5 h-3.5" /> <h4>Hungry for the Real Deal?</h4>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight scale-y-105 select-none leading-none">
                Taste the Smashed <br/>Obsession Yourself.
              </h2>
              
              <h4 className="text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
                Enough reading about the perfect crust. It’s time to taste what happens when engineering principles meet pure, unadulterated burger worship.
              </h4>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/menu"
              >
                <Button className="px-8 py-8" size="xl">

                Explore the Menu
                </Button>
              </Link>
             
            </motion.div>
          </div>
        </section>

      </div>
    </SmoothScroll>
  );
}