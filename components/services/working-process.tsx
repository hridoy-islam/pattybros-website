"use client";

import React, { useRef, useLayoutEffect } from "react";
import { servicesContent } from "@/utils/content";
import { cn } from "@/utils/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WorkingProcess() {
  const { pretitle, title, steps } = servicesContent.workingProcess;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        });

        // 1. Reveal Header
        tl.fromTo(".process-header-elem",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
        );

        // 2. Staggered Card Cascade
        tl.fromTo(cardsRef.current,
          { y: 50, opacity: 0, scale: 0.95 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.1, 
            ease: "back.out(1.2)" 
          },
          "-=0.6"
        );

        // 3. Reveal Connectors (Arrows)
        tl.fromTo(".process-connector",
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          "-=0.4"
        );

      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      // Using bg-secondary. Assuming it's a dark color in your tailwind config.
      className="relative py-24 md:py-36 bg-secondary text-secondary-foreground overflow-hidden"
    >
      {/* Immersive Background Glow - breaks up the solid dark color */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-primary/10 blur-[150px] rounded-[100%] pointer-events-none opacity-50" />

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20 md:mb-28 flex flex-col items-center">
          <span className="process-header-elem inline-block py-2 px-5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-6 border border-primary/20 backdrop-blur-sm">
            {pretitle}
          </span>
          <h2 className="process-header-elem text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] max-w-3xl">
            {title}
          </h2>
        </div>
        
        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 relative">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="relative flex items-center w-full">
                {/* Card */}
                <div 
                  ref={el => { cardsRef.current[index] = el }}
                  className="relative w-full h-full p-8 md:p-6 lg:p-8 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/[0.06] hover:border-primary/50 transition-all duration-500 group overflow-hidden flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 z-10"
                >
                  {/* Decorative Watermark Number */}
                  <div className="absolute -right-4 -bottom-6 text-[100px] font-black leading-none text-white/[0.03] group-hover:text-primary/[0.05] transition-colors duration-500 pointer-events-none select-none">
                    0{index + 1}
                  </div>

                  {/* Icon / Top Indicator */}
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-500">
                    <span className="text-sm font-black text-white/50 group-hover:text-primary transition-colors">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-white leading-tight">
                    {step.title.split(' ').slice(2).join(' ')}
                  </h3>
                  <p className="text-[15px] font-medium text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                    {step.description}
                  </p> 
                </div>

                {/* Connector Arrow (Visible only on desktop between cards) */}
                {!isLast && (
                  <div className="process-connector absolute -right-4 lg:-right-3 top-1/2 -translate-y-1/2 z-0 hidden lg:flex items-center justify-center w-8 h-8 opacity-50 text-white/30">
                    <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}