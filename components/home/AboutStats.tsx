"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Content stagger reveal
      gsap.fromTo(
        ".about-text-element",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Badge pop animation
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.6, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: badgeRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Parallax floating doodles
      gsap.to(".floating-doodle-1", {
        y: -30,
        rotation: 15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".floating-doodle-2", {
        y: 20,
        rotation: -10,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-black py-24 lg:py-32 overflow-hidden select-none"
    >
      {/* ================= BACKGROUND GRAPHICS ================= */}
      {/* Top Right Rotating Burger Icon */}
      <div className="hidden lg:block absolute right-[5%] top-[3%] w-40 h-40 pointer-events-none z-10 floating-doodle-1">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Center Burger Image */}
          <div className="absolute w-[70px] h-[70px] z-20 flex items-center justify-center">
            <Image
              src="/burger-doodle.png"
              alt="Burger Icon"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
          {/* Outer Rotating Text Ring */}
          <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <path
                  id="aboutTextCircle"
                  d="M 100, 100 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
                />
              </defs>
              <text className="text-[11px] font-bold fill-neutral-700 tracking-[0.2em] uppercase font-sans">
                <textPath href="#aboutTextCircle" startOffset="0%">
                  THE HOME OF PREMIUM SMASH BURGERS • LONDON •
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Left Fries Doodle */}
      <div className="hidden md:block absolute left-[5%] bottom-[10%] w-24 h-24 opacity-20 pointer-events-none floating-doodle-2">
        <Image
          src="/fries-doodle.png"
          alt="Fries Outline"
          fill
          className="object-contain"
        />
      </div>

      {/* Decorative Lines Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute left-0 top-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#000_40px,#000_41px)]" />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container mx-auto  relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <div ref={imageRef} className="relative">
            {/* Main Image Container */}
            <div className="relative aspect-[4/5]  overflow-hidden group">
              <Image
                src="/home1.jpg"
                alt="Premium Smash Burger"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* Floating Badge */}
            <div
              ref={badgeRef}
              className="absolute -bottom-6 -right-6 bg-primary-foreground text-white px-6 py-4 rounded-2xl shadow-xl z-10 backdrop-blur-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">
                South East
              </p>
              <p className="text-lg font-black tracking-tight">LONDON</p>
            </div>

            {/* Decorative Dots Pattern */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-foreground/5 rounded-3xl -z-10 hidden lg:block" />
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="space-y-6 lg:space-y-8">
            {/* Eyebrow */}
            <div className="about-text-element flex items-center gap-3">
              <div className="w-8 h-[2px] bg-primary-foreground" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground">
                THE HOME OF PREMIUM SMASH BURGERS IN LONDON
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="about-text-element text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[1.1] tracking-tight text-neutral-900">
              Quality British Beef,
              <br />
              <span className="text-primary-foreground">Bold Flavours</span>
            </h2>

            {/* Description Paragraphs */}
            <div className="about-text-element space-y-4 text-neutral-600">
              <h4 className="text-sm md:text-base leading-relaxed">
                We use quality British aged beef, carefully sourced ingredients
                and bold flavours inspired by Britain's love of proper comfort
                food.
              </h4>
              <h4 className="text-sm md:text-base leading-relaxed">
                Every burger starts with carefully selected beef smashed on a hot
                griddle to create the crispy edges that smash burger fans love.
                Combined with melted cheese, fresh toppings, toasted potato buns
                and our signature sauces, every bite delivers the perfect balance
                of crunch, juiciness and flavour.
              </h4>
              <h4 className="text-sm md:text-base leading-relaxed">
                Located in South East London, Patty Bros has quickly become a
                destination for burger lovers looking for authentic smash burgers,
                loaded fries and quality street food made properly.
              </h4>
              <h4 className="text-sm md:text-base leading-relaxed">
                Whether you're dining in, ordering takeaway, booking catering or
                searching for the best smash burger in London, Patty Bros delivers
                fresh food, fast service and unforgettable flavour.
              </h4>
            </div>

            {/* CTA Buttons */}
            <div className="about-text-element flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => router.push("/menu")}
                className="bg-primary-foreground hover:bg-primary-foreground/90 text-white px-8 py-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Explore Our Menu
              </Button>
              <Button
                onClick={() => router.push("/takeaway")}
                variant="outline"
                className="border-2 border-neutral-900  hover:bg-neutral-900 hover:text-white px-8 py-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Order Takeaway
              </Button>
            </div>

            {/* Quick Info Strip */}
            <div className="about-text-element flex items-center gap-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-semibold text-neutral-700">
                  Fresh Daily
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-neutral-700">
                  Quality British Beef
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}