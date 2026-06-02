"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { servicesContent } from "@/utils/content";
import { cn } from "@/utils/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function FaqsSection() {
  const { pretitle, title, image, items } = servicesContent.faqs;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        });

        // 1. Header Reveal
        tl.fromTo(".faq-header-elem", 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
        );

        // 2. Image Mask Reveal with Scale
        tl.fromTo(imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0% round 2rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.5, ease: "expo.inOut" },
          "-=0.8"
        );
        
        gsap.fromTo(imageRef.current,
          { scale: 1.2 },
          { scale: 1, duration: 2, ease: "power3.out", scrollTrigger: {
            trigger: imageWrapperRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }}
        );

        // 3. Accordion Items Cascade
        tl.fromTo(".faq-item",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=1.2"
        );

      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#fcfcfc] dark:bg-[#060a11] overflow-hidden transition-colors duration-700"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Header Area */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="faq-header-elem inline-block py-2 px-5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-6 border border-primary/20">
            {pretitle}
          </span>
          <h2 className="faq-header-elem text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {title}<span className="text-primary">.</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT: STICKY IMAGE --- */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-32">
            <div 
              ref={imageWrapperRef}
              className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 will-change-transform"
            >
              <Image 
                ref={imageRef}
                src={image} 
                alt="FAQ Visual" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover will-change-transform" 
              />
              {/* Premium Inner Shadow */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[2rem] pointer-events-none" />
            </div>
          </div>

          {/* --- RIGHT: ACCORDION --- */}
          <div className="lg:col-span-7 pt-4 lg:pt-0">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {items.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="faq-item group border border-slate-200 dark:border-white/10 rounded-2xl px-6 bg-white dark:bg-white/[0.02] transition-all duration-300 hover:shadow-md dark:hover:bg-white/[0.04] data-[state=open]:border-primary/30 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary hover:no-underline text-left py-6 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:text-[17px] leading-relaxed text-slate-600 dark:text-slate-400 pb-6 pr-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
}