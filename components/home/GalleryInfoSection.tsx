"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const GALLERY_ITEMS = [
  { 
    src: "/home3.jpg", 
    title: "Signature Burgers",
  },
  { src: "/Beef Puck.jpg", title: "Beef Puck" },
  { src: "/Table Setup.jpg", title: "Table Setup" },
  // { src: "/Wine & Dine.jpg", title: "Wine & Dine" },
];

export default function GalleryInfoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".gallery-card");

      cards.forEach((card: any) => {
        const overlay = card.querySelector(".hover-overlay");
        const text = card.querySelector(".hover-text");

        // Create individual timelines for each card
        const tl = gsap.timeline({ paused: true });

        tl.to(overlay, {
          opacity: 0.9,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.out",
        }).fromTo(
          text,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
          "-=0.2"
        );

        // Bind hover triggers
        card.addEventListener("mouseenter", () => tl.play());
        card.addEventListener("mouseleave", () => tl.reverse());
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-white py-20 select-none ">
      <div className="container  mx-auto">
 {/* 1. UPGRADED: 4-Column Interactive Image Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
        {GALLERY_ITEMS.map((item, index) => (
          <div 
            key={index} 
            className="gallery-card relative h-[450px] overflow-hidden cursor-pointer group rounded-sm"
          >
            {/* Base Image asset */}
            <Image 
              src={item.src} 
              alt={item.title} 
              fill 
  className="object-cover brightness-75 transition-transform duration-700 group-hover:scale-105" 
            />
            
            {/* Dynamic GSAP Interaction Mask (Primary Yellow) */}
            <div className="hover-overlay absolute inset-0 bg-primary opacity-0 flex items-center justify-center m-3 rounded-sm pointer-events-none">
              {/* Dynamic Animated Wording (Primary Foreground Red) */}
              <h3 className="hover-text text-primary-foreground font-black text-2xl uppercase tracking-tighter text-center px-4 opacity-0">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

     
      </div>
      
     
    </section>
  );
}