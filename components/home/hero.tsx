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
      // Replaced IDs with classes for stable querying
      .fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=1" // Start earlier
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
        { opacity: 0, scale: 0.5, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.5)" },
        "-=0.8"
      );

      // 2. Scroll Parallax for Background
      gsap.to(bgRef.current, {
        yPercent: 30,
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

      // 4. Continuous slow rotation for the badge
      if (decorativeCircleRef.current) {
        gsap.to(decorativeCircleRef.current, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "linear", // Smooth continuous spin
        });
      }

    }, heroRef);

    // Cleanup ensures no duplicate animations on hot-reload
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="relative w-full h-[100vh] flex items-center overflow-hidden bg-black text-white"
    >
      {/* Background Layer */}
      <div ref={bgRef} className="absolute inset-0 z-0 h-[120%] w-full top-[10%]">
        <Image
          src="/hero1.jpg" // Make sure this path is correct in your public folder
          alt="Delicious Food"
          fill
          className="object-cover brightness-50" 
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="container relative z-10 mx-auto ">
        <div ref={textRef} className="max-w-4xl space-y-6 lg:space-y-8">
          
         

          <h1 className="text-5xl md:text-7xl  font-black uppercase leading-[1.1] tracking-tight">
            <span className="hero-heading-line block">Delicious Food &</span>
            <span className="hero-heading-line block text-primary">Memorable Dining</span>
          </h1>

          <h3 className="hero-subtitle text-lg md:text-xl text-white font-medium leading-relaxed max-w-2xl">
            Indulge in a fusion of traditional recipes and contemporary flair, crafted by master chefs using the freshest locally sourced ingredients. 
          </h3>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-6 lg:pt-8">
            <Link href="/order">
              <Button
                className="bg-primary-foreground  text-white font-bold uppercase tracking-wider px-10 py-7 text-base rounded-sm transition-colors duration-300"
              >
                Order Now!
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:text-white hover:bg-primary font-bold uppercase tracking-wider px-10 py-7 text-base rounded-sm transition-colors duration-300 bg-transparent"
              >
                Explore Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Rotating Badge */}
      <div 
        ref={decorativeCircleRef} 
        className="absolute top-32 right-20 z-20 w-32 h-32 hidden lg:flex items-center justify-center rounded-full border border-dashed border-primary/50"
      >
        <div className="text-primary font-bold text-xs uppercase text-center tracking-widest leading-loose">
          Since <br/> <span className="text-lg">1995</span>
        </div>
      </div>
    </section>
  );
}