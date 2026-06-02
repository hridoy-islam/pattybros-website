"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { aboutContent } from "@/utils/content";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Safely register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutStrategiesCta() {
  const { pretitle, title, items, buttonText, buttonHref, image } = aboutContent.ctaStrategies;
  
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Subtle Image Scale/Parallax on Scroll
      gsap.fromTo(imageRef.current,
        { scale: 1.15, yPercent: -5 },
        {
          scale: 1,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5, // Buttery smooth scrub
          }
        }
      );

      // 2. High-End Staggered Text Reveal
      // We target anything with the 'reveal-item' class
      const revealElements = gsap.utils.toArray<HTMLElement>('.reveal-item');
      
      gsap.fromTo(revealElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
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
    <section ref={sectionRef} className="relative bg-[#060a11] overflow-hidden py-24 md:py-32">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* --- LEFT: IMAGE SIDE --- */}
          <div className="relative group w-full max-w-[600px] mx-auto lg:mx-0">
            <div 
              ref={imageWrapperRef}
              className="relative aspect-[4/5] md:aspect-square w-full rounded-[2.5rem] overflow-hidden ring-1 ring-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] bg-slate-900"
            >
              <Image
                ref={imageRef}
                src={image}
                alt="Digital Strategies"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              />
              {/* Refined Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a11] via-[#060a11]/20 to-transparent opacity-80" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />
            </div>
          </div>

          {/* --- RIGHT: TEXT SIDE --- */}
          <div className="flex flex-col space-y-10 lg:pl-6">
            
            {/* Header Content */}
            <div className="space-y-6">
              <span className="reveal-item inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
                {pretitle}
              </span>

              <h2 className="reveal-item text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                {title}
              </h2>
            </div>

            {/* List Items (Upgraded to a structured timeline look) */}
            <div className="relative space-y-8 pt-4">
              {/* Subtle vertical line connecting items */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent hidden sm:block" />

              {items.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className="reveal-item relative sm:pl-10 space-y-2"
                >
                  {/* Glowing Dot Indicator */}
                  <div className="absolute left-0 top-1.5 hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-[#060a11] border border-primary/50 ring-4 ring-[#060a11]">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                    {/* Mobile icon fallback */}
                    <CheckCircle2 className="sm:hidden w-5 h-5 text-primary" />
                    {item.heading}
                  </h3>
                  <p className="text-base md:text-lg text-white font-normal leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="reveal-item pt-8">
              <Link href={buttonHref} className="group inline-block">
                <Button 
                  size="xl" 
                >
                  <span>{buttonText}</span>
                  <span className="ml-3 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                     <ArrowRight size={18} strokeWidth={2.5} />
                  </span>
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}