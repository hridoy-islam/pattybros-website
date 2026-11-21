"use client";

import { useEffect, useRef, useState } from "react";

const text =
  "Every lash set is designed for your eye shape and personal style, from soft classics to Russian volume, wispy, anime and mega volume, for an elegant finish you will love.";
const words = text.split(" ");
const STRONG = "elegant";

// Zee's welcome, set large. Each word turns from soft to full ink as the statement crosses the screen.
export default function Welcome() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(words.length); // fully inked until the page has measured, and without script

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top reaches 85% of the screen, 1 when the bottom reaches 45%
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.4);
      setLit(Math.round(Math.min(1, Math.max(0, p)) * words.length));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="py-14 md:py-[88px]" id="welcome" aria-labelledby="welcome-h">
      <div className="container">
        <h2 id="welcome-h" className="eyebrow">
          Welcome to Lashes by Zee London
        </h2>
        <p ref={ref} className="mt-5 max-w-[22em] font-display text-[clamp(30px,3.9vw,56px)] leading-[1.18] tracking-[-0.015em]">
          {words.map((w, i) => {
            const on = i < lit;
            const strong = w.replace(/[^a-z]/gi, "") === STRONG;
            return (
              <span
                key={i}
                className={`transition-colors duration-150 ${
                  on ? (strong ? "text-primary-dark" : "text-ink") : "text-ink/35"
                }`}
              >
                {w}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
