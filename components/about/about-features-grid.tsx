"use client";

import { useRef, useLayoutEffect } from "react";
import { aboutContent } from "@/utils/content";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Safely register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutFeaturesGrid() {
  const { pretitle, title, items } = aboutContent.teamFeatures;
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Reveal Header Elements
      gsap.fromTo('.reveal-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );

      // 2. Staggered Card Reveal with slight scale/spring
      gsap.fromTo('.feature-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.2)", // Gives a tiny, premium "snap" into place
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
      
      {/* Subtle Background Glow for Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 ">
        
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24 flex flex-col items-center space-y-6">
          <span className="reveal-header inline-block py-1.5 px-5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase ring-1 ring-primary/20 backdrop-blur-sm">
            {pretitle}
          </span>
          <h2 className="reveal-header text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            {title}
          </h2>
        </div>
        
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((feature: any, index: number) => (
            <div 
              key={index}
              className="feature-card group relative p-8 md:p-10 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
            >
              {/* Icon Wrapper */}
              <div className="w-14 h-14 mb-8 rounded-2xl bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:ring-primary/50 group-hover:scale-110">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-500" />
              </div>
              
              {/* Card Text */}
              <div className="mt-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-base text-slate-600 font-normal leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Subtle hover line at the bottom of the card */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50 group-hover:shadow-[0_-5px_10px_rgba(var(--primary),0.2)]" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}