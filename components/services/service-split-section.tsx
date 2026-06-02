"use client";

import { useRef, useLayoutEffect, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/utils";
import { Megaphone, Code, Paintbrush, ArrowUpRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ICON_MAP = {
  marketing: Megaphone,
  development: Code,
  design: Paintbrush,
};

interface ServiceSectionProps {
  id: string;
  iconId: string;
  title: string;
  description1: string;
  description2?: string;
  lists: string[][];
  buttonText: string;
  image: string;
  imagePosition?: "left" | "right";
  bgColor?: "light" | "dark";
}

// --- MAGNETIC BUTTON COMPONENT ---
// Adds a premium mouse-tracking micro-interaction
function MagneticButton({ children, href, isDark }: { children: React.ReactNode, href: string, isDark: boolean }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    gsap.to(buttonRef.current, { x: x * 0.3, y: y * 0.5, duration: 1, ease: "power3.out" });
    gsap.to(textRef.current, { x: x * 0.2, y: y * 0.2, duration: 1, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <Link 
      href={href} 
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full px-8 font-medium transition-colors duration-300",
        isDark 
          ? "bg-primary text-white hover:bg-primary/90" 
          : "bg-primary text-white hover:bg-primary/90"
      )}
    >
      <span ref={textRef} className="flex items-center gap-2 pointer-events-none relative z-10">
        {children}
        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
      {/* Button Hover Glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}

// --- MAIN SECTION COMPONENT ---
export function ServiceSplitSection(props: any) {
  const Icon = ICON_MAP[props.iconId as keyof typeof ICON_MAP] || Code;
  const isDark = props.bgColor === "dark";
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Use matchMedia to ensure performance on mobile devices
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        
        // 1. Infinite Floating Icon
        gsap.to(iconRef.current, {
          y: -10,
          rotation: 2,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // 2. Master Reveal Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%", 
            toggleActions: "play none none reverse",
          }
        });

        tl.fromTo(imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0% round 2.5rem)" }, // Modern inset approach
          { 
            clipPath: "inset(0% 0% 0% 0% round 2.5rem)", 
            duration: 1.6, 
            ease: "expo.inOut" 
          }
        )
        .fromTo(".reveal-text",
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1,
            duration: 1.2, 
            stagger: 0.1, 
            ease: "power4.out" 
          },
          "-=1.0" 
        )
        .fromTo(".reveal-list-item",
          { x: -20, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.05, 
            ease: "power3.out" 
          },
          "-=0.8"
        )
        .fromTo(".reveal-btn",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
          "-=0.6"
        );

        // 3. Image Parallax & Scale
        gsap.fromTo(imageRef.current,
          { yPercent: -10, scale: 1.15 },
          {
            yPercent: 10,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );

      }, sectionRef);

      return () => ctx.revert(); 
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      id={props.id}
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32 overflow-hidden transition-colors duration-700", 
        isDark ? "bg-black" : "bg-white"
      )}
    >
      {/* Background Ambient Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none opacity-50 blur-[120px]",
        isDark ? "bg-primary/20" : "bg-primary/5"
      )} />

      <div className="container relative z-10 mx-auto ">
        <div className={cn(
          "grid lg:grid-cols-2 gap-16 lg:gap-24 items-center",
        )}>
          
          {/* --- CONTENT SIDE --- */}
          <div className={cn(
              "flex flex-col w-full max-w-xl mx-auto lg:mx-0", 
              props.imagePosition === "left" ? "lg:order-2 lg:pl-8" : "lg:order-1 lg:pr-8"
          )}>
            
            {/* Header / Title */}
            <div className="flex flex-col gap-6 mb-8">
              <div 
                ref={iconRef}
                className={cn(
                  "reveal-text w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md shadow-lg",
                  isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                )}
              >
                <Icon className={cn("w-6 h-6", isDark ? "text-white" : "text-primary")} />
              </div>
              
              <h2 className={cn(
                "reveal-text text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]", 
                isDark ? "text-white" : "text-black"
              )}>
                {/* Subtle Gradient applied to part of the text for a modern look */}
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60">
                  {props.title.split(' ')[0]} 
                </span>{' '}
                {props.title.split(' ').slice(1).join(' ')}
              </h2>
            </div>
            
            {/* Descriptions */}
            <article className={cn(
              "space-y-6 text-lg md:text-xl  font-light", 
              isDark ? "text-white" : "text-black"
            )}>
              <p className="reveal-text">{props.description1}</p>
              {props.description2 && (
                <p className="reveal-text">{props.description2}</p>
              )}
            </article>

            {/* List of Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-10">
              {props.lists.map((sublist: any, i:any) => (
                <ul key={i} className="space-y-4">
                  {sublist.map((item:any, idx:any) => (
                    <li key={idx} className="reveal-list-item flex items-start gap-3 group/item">
                      <CheckCircle2 className="text-primary w-5 h-5 mt-[3px] opacity-70 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:opacity-100" />
                      <span className={cn(
                        "text-base font-medium transition-colors duration-300", 
                        isDark ? "text-white group-hover/item:text-white" : "text-black group-hover/item:text-slate-900"
                      )}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            {/* Magnetic Button */}
            <div className="pt-12 reveal-btn inline-block">
              <MagneticButton href="/contact" isDark={isDark}>
                {props.buttonText}
              </MagneticButton>
            </div>
            
          </div>

          {/* --- IMAGE SIDE --- */}
          <div className={cn(
            "relative w-full max-w-xl mx-auto group",
            props.imagePosition === "left" ? "lg:order-1" : "lg:order-2"
          )}>
            <div 
              ref={imageWrapperRef}
              className="relative aspect-[4/5] w-full overflow-hidden will-change-transform rounded-[2.5rem] bg-slate-200 dark:bg-slate-800"
            >
              <div className="absolute inset-0 w-full h-[120%] -top-[10%]">
                <Image 
                  ref={imageRef}
                  src={props.image} 
                  alt={props.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover will-change-transform transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              
              {/* Premium Inner Shadow Overlay */}
              <div className={cn(
                "absolute inset-0 pointer-events-none rounded-[2.5rem] ring-1 ring-inset",
                isDark ? "ring-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" : "ring-black/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"
              )} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}