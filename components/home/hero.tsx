"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const decorativeCircleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger safely
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.fromTo(
        bgRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
      )
      .fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=1"
      )
      .fromTo(
        ".hero-heading-line",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2 },
        "-=0.6"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 },
        "-=0.6"
      )
      .fromTo(
        decorativeCircleRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.5)" },
        "-=0.8"
      );

      // 2. Scroll Parallax for Background
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Scroll Fade Out for Text Content
      gsap.to(textRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "10% top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="relative w-full h-[100vh] flex items-center overflow-hidden bg-zinc-950 text-white select-none"
    >
      {/* Background Layer */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[115%] w-full -top-[5%]">
        <Image
          src="/hero1.jpg" 
          alt="Patty Bros Smash Burgers"
          fill
          className="object-cover brightness-50" 
          priority
        />
        {/* Advanced Multi-Stage Gradient Overlay Matrix */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="container relative z-10 mx-auto px-6 sm:px-12 mt-10">
        <div ref={textRef} className="max-w-5xl space-y-6 lg:space-y-8">
          
          {/* Subtle Premium Header Accent */}
          <div className="hero-eyebrow flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary pt-8">
            <span className="w-6 h-[1px] bg-primary block" />
            <h4>British Style Premium Smash Burgers</h4>
          </div>

          <h1 className="text-2xl md:text-7xl font-black uppercase leading-[1.05] tracking-tight">
            <span className="hero-heading-line text-primary-foreground block">PATTY BRO'S</span>
            <span className="hero-heading-line block text-primary">We Make Burgers. They Say the Best.</span>
          </h1>

          <h3 className="hero-subtitle text-xs md:text-lg text-zinc-100 font-medium leading-relaxed max-w-4xl">
            Freshly smashed British Dry Aged beef patties, melted cheese, toasted potato buns and Secret house-made sauces. No gimmicks. No shortcuts. Just proper smash burgers cooked fresh to order every single day.
          </h3>

          <h3 className="hero-subtitle text-xs md:text-base text-zinc-100 leading-relaxed max-w-3xl">
            Whether you're grabbing lunch, ordering delivery, or booking catering for an event, Patty Bros brings crispy-edged, Juicy flavour-packed smash burgers that hit every time.
          </h3>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 max-w-md sm:max-w-none">
            <Link href="/click-and-collect">
              <Button
                className="w-full sm:w-auto bg-primary-foreground hover:bg-primary-foreground/95 uppercase tracking-wider px-10 py-7 text-sm rounded-none transition-transform duration-300 hover:-translate-y-0.5"
              >
                Order Now!
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:text-zinc-950 hover:bg-white font-black uppercase tracking-wider px-10 py-7 text-sm rounded-none bg-transparent transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Badge Layer */}
      <div 
        ref={decorativeCircleRef} 
        className="absolute bottom-24 right-12 md:right-24 z-30 w-36 h-36 hidden lg:flex items-center justify-center rounded-full border border-dashed border-primary/40 bg-black/40 backdrop-blur-md shadow-2xl"
      >
        <div className="text-primary font-medium text-[10px] uppercase text-center tracking-[0.25em] leading-relaxed">
          Fresh<br/> 
          <span className="text-2xl font-black text-white tracking-normal my-0.5 block font-serif">DAILY</span>
          <span className="text-[9px] text-zinc-400 block tracking-widest lowercase italic">cooked to order</span>
        </div>
      </div>
    </section>
  );
}