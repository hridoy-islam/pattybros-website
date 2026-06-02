"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { aboutContent } from "@/utils/content";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Safely register scrolltrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutCompanyIntro() {
  const { title, description, buttonText, buttonHref, image } = aboutContent.companyIntro;
  const containerRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // SEO-Friendly formatted HTML for title
  const formattedTitle = title.replace("Cyberpeers", "<span class='text-primary inline-block'>Cyberpeers</span>");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // Smoother Parallax on the image
        gsap.fromTo(imageRef.current, 
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: imageWrapperRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5, // Buttery smooth scrubbing effect
            },
        });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* --- TEXT CONTENT --- */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-8 max-w-2xl"
          >
          

            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] "
              dangerouslySetInnerHTML={{ __html: formattedTitle }} 
            />
            
            <p className="text-lg md:text-xl text-black leading-relaxed font-normal">
              {description}
            </p>
            
            <div className="pt-4">
              {/* Wrapped Link in 'group' for cohesive hover animations */}
              <Link href={buttonHref} className="group inline-block">
                <Button size="xl" className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    <span>{buttonText}</span>
                    <span className="ml-3 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        <ArrowUpRight size={20} strokeWidth={2.5} />
                    </span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* --- IMAGE PARALLAX CONTAINER --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative lg:ml-auto w-full max-w-[600px]"
          >
            {/* Modern Image Masking & Border */}
            <div 
              ref={imageWrapperRef} 
              className="relative aspect-[4/5] md:aspect-square w-full overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-muted ring-1 ring-border shadow-2xl"
            >
                {/* Image scaling allows for parallax without showing empty background */}
                <div ref={imageRef} className="absolute inset-0 w-full h-[130%] -top-[15%]">
                    <Image
                        src={image}
                        alt="Cyberpeers Company Overview"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    {/* Subtle inner shadow overlay for depth */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                </div>
            </div>
            
            {/* Decorative blur blob behind the image to make it "pop" off the page */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}