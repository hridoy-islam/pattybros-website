"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Smooth Time-based Count Up Hook for stats
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // Animation duration in ms

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Trigger animation when component mounts
    requestAnimationFrame(animate);
  }, [target]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutStats() {
  const stats = [
    { target: 278, suffix: "+", label: "Visitors Daily" },
    { target: 15, suffix: "k", label: "Deliveries Monthly" },
    { target: 23, suffix: "k", label: "Positive Feedback" },
    { target: 8, suffix: "+", label: "Awards and Honors" },
  ];

  return (
    <section className="bg-white text-black py-24 relative overflow-hidden select-none">
      
      {/* ================= BACKGROUND GRAPHICS / DOODLES ================= */}
      {/* Left Main Burger Image */}
      <div className="hidden xl:block absolute left-4 top-1/2 -translate-y-1/2 w-[280px] h-[280px] z-10">
        <Image 
          src="/burger-isolated.png" 
          alt="Isolated Burger" 
          fill 
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Top Left Floating Fries Doodle */}
      <div className="hidden md:block absolute left-[22%] top-12 w-20 h-20 opacity-20 pointer-events-none">
        <Image 
          src="/fries-doodle.png" 
          alt="Fries Outline" 
          fill 
          className="object-contain" 
        />
      </div>

      {/* Top Right Rotating Badge Graphic */}
      <div className="absolute right-6 top-6 w-32 h-32 animate-[spin_20s_linear_infinite] pointer-events-none z-10">
        <Image 
          src="/badge-doodle.png" 
          alt="Signatures Dine Sip Eat Badge" 
          fill 
          className="object-contain" 
        />
      </div>

      {/* Middle Right Floating Pizza Slice Doodle */}
      <div className="hidden md:block absolute right-[8%] top-[45%] w-24 h-24 opacity-20 pointer-events-none">
        <Image 
          src="/pizza-doodle.png" 
          alt="Pizza Outline" 
          fill 
          className="object-contain" 
        />
      </div>
      {/* ================================================================= */}

      <div className="container mx-auto relative z-20">
        {/* Main Content Content Block */}
        <div className="text-center max-w-5xl mx-auto space-y-6 mb-24">
          
          {/* Subheading with Red Line */}
          <div className="flex items-center justify-center gap-2 text-primary-foreground font-bold tracking-widest uppercase text-xs">
            <span className="w-7 h-[2px] bg-primary-foreground"></span>
            <h4>

            Best Food For Your Family
            </h4>
          </div>

          {/* Main Typography Header matching graphic text font dynamics */}
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.15] tracking-tight text-neutral-900 ">
            True & Memorable Tasta Made <br className="hidden md:inline" /> With Love and Tradition
          </h2>

          {/* Body Block Paragraph matching mockup content */}
          <h4 className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-6xl mx-auto font-medium">
            Restaurant food dolor sit amet, consectetur adipiscing elit, sed do eiusmod eius modi 
            tempora incidunt ut labore et dolore magnam aliquam quaerat eius modi tempora incidunt 
            ut labore et dolore magnam aliquam quaerat olore magna aliqua. Ut enim ad minim veniam
          </h4>

          {/* Call to action Button with exact visual color weight */}
          <Button className=" text-white px-9 py-6 rounded-full text-xs font-bold uppercase tracking-wider mt-4 transition-colors duration-300 shadow-md">
            Get Started
          </Button>
        </div>

        {/* Counter Stats Footer Layout Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center max-w-5xl mx-auto pt-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="space-y-1 group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Animated Target Tracker number display */}
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-neutral-900">
                <Counter target={stat.target} suffix={stat.suffix} />
              </h3>
              
              {/* Stat Metadata Label matching style values */}
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest pt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}