"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "1. How do I Claim a Free Coupon?",
    answer:
      "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
  },
  {
    id: 2,
    question: "2. What is your least favorite fast food restaurant and why?",
    answer:
      "Our dedication strictly lies in organic, handcrafted, smashed beef blends. We aim to break the traditional cold assembly line process of modern fast-food sectors by guaranteeing fresh, sizzling pickups every single time.",
  },
  {
    id: 3,
    question: "3. Is there any limit for order's menu?",
    answer:
      "There are absolutely no upper limits on individual item quantities for Click & Collect orders. However, for massive corporate events or catering configurations, we recommend scheduling 24 hours in advance via our custom dashboard matrix.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative bg-white text-zinc-900 py-24 overflow-hidden select-none">
      {/* ==================== DECORATIVE PREMIUM WATERMARKS ==================== */}
      {/* Subtle food doodle layout backdrops to replicate the background texture safely */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px] z-0" />

      {/* Soft abstract vector blobs acting as decorative graphic layers */}
      <div className="absolute -left-12 top-1/4 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 bottom-1/4 w-60 h-60 rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          {/* LEFT SIDE COLUMN: INTRO & ACCORDION SYSTEM (6 Columns) */}
          <div className="space-y-8">
            <div className="space-y-3">
              {/* FAQ Pill Tagline with matching red bar */}
              <div className="flex items-center gap-3 text-primary-foreground font-extrabold tracking-[0.2em] uppercase text-xs">
                <span className="w-8 h-[2px] bg-primary-foreground" />
                <h4>FAQ</h4>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-zinc-950 leading-[1.1] tracking-tight ">
                Come to our restaurant, <br /> ready your food
              </h2>
            </div>

            {/* Functional Interactive Mockup Accordion */}
            <div className="space-y-4">
              {FAQ_DATA.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-zinc-100 overflow-hidden transition-all duration-300"
                  >
                    {/* Accordion Trigger Head */}
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center gap-4 p-5 text-left transition-colors duration-200 hover:bg-zinc-50"
                    >
                      {/* Icon Switcher based on global primary variables */}
                      <div
                        className={`w-6 h-6 shrink-0 flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-primary-foreground text-white" : "bg-primary-foreground text-white"}`}
                      >
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </div>

                      <span
                        className={`text-sm md:text-md font-black uppercase tracking-tight transition-colors duration-200 ${isOpen ? "text-primary-foreground" : "text-zinc-800"}`}
                      >
                        <h4>{faq.question}</h4>
                      </span>
                    </button>

                    {/* Collapsible Animated Body Wrapper */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 pt-1 text-zinc-500 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE COLUMN: STATIC 4-BLOCKED IMAGE AND STATS MATRIX (6 Columns) */}
          <div className="grid grid-cols-8 gap-4">
            {/* Top Left: Large burger image - spans 5 columns */}
            <div className="col-span-5 relative h-[240px] bg-zinc-100 shadow-sm overflow-hidden">
              <Image
                src="/home3.jpg"
                alt="Burgers on counter"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            {/* Top Right: Success Event - smaller, spans 3 columns */}
            <div className="col-span-3 relative h-[240px] bg-primary overflow-hidden group shadow-sm">
              <Image
                src="/home1.jpg"
                alt="Success Event"
                fill
                className="object-cover opacity-30 grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 text-zinc-950 z-10">
                <h3 className="text-3xl font-black tracking-tighter leading-none">
                  542+
                </h3>
                <p className="text-xs font-black uppercase tracking-wider mt-1">
                  Success Event
                </p>
              </div>
            </div>

            {/* Bottom Left: Daily Customers - larger, spans 5 columns */}
            <div className="col-span-3 relative h-[240px] bg-primary-foreground overflow-hidden group shadow-sm">
              <Image
                src="/Daily Customers.jpg"
                alt="Daily Customers"
                fill
                className="object-cover opacity-20 contrast-150 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-primary-foreground/70 mix-blend-color-burn" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 text-white z-10">
                <h3 className="text-3xl font-black tracking-tighter leading-none">
                  243+
                </h3>
                <p className="text-xs font-black uppercase tracking-wider mt-1">
                  Daily Customers
                </p>
              </div>
            </div>

            {/* Bottom Right: Chef image - smaller, spans 3 columns */}
            <div className="col-span-5 relative h-[240px] bg-zinc-100 shadow-sm overflow-hidden">
              <Image
                src="/home6.jpg"
                alt="Our professional Chef"
                fill
                className="object-cover object-bottom"
                sizes="(max-width: 768px) 100vw, 200px "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
