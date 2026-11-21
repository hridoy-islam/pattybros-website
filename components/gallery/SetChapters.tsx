"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type LashSet = { id: string; src: string; alt: string; title: string; text: string };

const ZOOM = 1.06; // each photo settles from this scale as it is uncovered
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);
const pad = (v: number) => String(v).padStart(2, "0");

// "Lash sets by style" as photo chapters (taste skill moment: photo-chapters).
// Live: the section holds on screen while the page scrolls. Each next photo is uncovered over the last
// from its foot upward, and the panel on its lower left changes to that set.
// At rest (reduced motion, or a screen under 600px tall) the sets stand one after another instead.
// Which one shows is decided in CSS (.chapters-live / .chapters-rest in globals.css), so nothing jumps on load.
export default function SetChapters({ sets }: { sets: LashSet[] }) {
  const n = sets.length;
  const hold = n <= 3 ? 2 : 3; // screens of scroll the section holds for, about two thirds of a screen a set
  const liveRef = useRef<HTMLDivElement>(null);
  const pics = useRef<(HTMLDivElement | null)[]>([]);
  const [on, setOn] = useState(0);

  useEffect(() => {
    const el = liveRef.current;
    if (!el) return;
    let raf = 0;
    const draw = () => {
      raf = 0;
      if (getComputedStyle(el).display === "none") return;
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      // set i owns [i/n, (i+1)/n); its photo is uncovered over the 45% of a share that straddles that
      // boundary, then holds; the words change half way through the wipe
      const seg = 1 / n;
      let k = 0;
      pics.current.forEach((pic, i) => {
        if (!pic) return;
        const u = i === 0 ? 1 : clamp((p - (i - 0.25) * seg) / (0.45 * seg));
        const e = easeOut(u);
        pic.style.setProperty("--c", `${((1 - e) * 100).toFixed(2)}%`);
        pic.style.setProperty("--z", (ZOOM - (ZOOM - 1) * e).toFixed(4));
        if (u >= 0.5) k = i;
      });
      setOn(k);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [n]);

  const head = (id: string) => (
    <>
      <h2 id={id} className="h2">
        Lash sets by style
      </h2>
      <p className="lead mt-4 max-w-prose">Four of our most booked styles. Each set is designed for the client&rsquo;s eye shape.</p>
    </>
  );

  return (
    <section id="styles" aria-label="Lash sets by style">
      {/* live */}
      <div ref={liveRef} className="chapters-live relative" style={{ height: `${(hold + 1) * 100}svh` }}>
        <div className="container sticky top-0 flex h-[100svh] flex-col pb-[96px] pt-[88px] sm:pb-8 md:pt-[104px]">
          <div>{head("styles-h")}</div>
          <div className="relative mt-8 min-h-0 flex-1 overflow-hidden bg-line">
            {sets.map((s, i) => (
              <div
                key={s.id}
                ref={(node) => {
                  pics.current[i] = node;
                }}
                className="absolute inset-0 [clip-path:inset(var(--c)_0_0_0)] [will-change:clip-path]"
                style={{ "--c": i === 0 ? "0%" : "100%", "--z": i === 0 ? 1 : ZOOM } as CSSProperties}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full origin-bottom scale-[var(--z)] object-cover [will-change:transform]"
                />
              </div>
            ))}

            <div className="absolute inset-x-3 bottom-3 z-10 bg-ivory p-5 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[440px] sm:p-8">
              <p className="font-display text-lg tabular-nums text-primary-dark" aria-hidden="true">
                {pad(on + 1)} / {pad(n)}
              </p>
              <ol className="mt-3 grid">
                {sets.map((s, i) => (
                  <li
                    key={s.id}
                    className={`[grid-area:1/1] transition-[opacity,transform] ${
                      i === on
                        ? "translate-y-0 opacity-100 [transition-delay:60ms] duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)]"
                        : "pointer-events-none translate-y-2 opacity-0 duration-200"
                    }`}
                  >
                    <h3 className="text-[28px] leading-tight md:text-[32px]">{s.title}</h3>
                    <p className="mt-2">{s.text}</p>
                    <Link href={`/booking?t=${s.id}`} className="link-arrow mt-4" tabIndex={i === on ? 0 : -1}>
                      Book this set
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* at rest */}
      <div className="chapters-rest section">
        <div className="container">
          {head("styles-rest-h")}
          <div className="mt-12 grid gap-16 md:gap-24">
            {sets.map((s, i) => (
              <article key={s.id} className="grid items-center gap-6 md:grid-cols-12">
                <Link
                  href={`/services#${s.id}`}
                  className={`group block aspect-[3/2] overflow-hidden md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}
                  aria-label={s.title}
                >
                  <img src={s.src} alt={s.alt} loading="lazy" className="zoom-img" />
                </Link>
                <div className={`md:col-span-4 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                  <p className="font-display text-lg tabular-nums text-primary-dark">{pad(i + 1)}</p>
                  <h3 className="mt-2 text-[32px] leading-tight">{s.title}</h3>
                  <p className="mt-3">{s.text}</p>
                  <Link href={`/booking?t=${s.id}`} className="link-arrow mt-5">
                    Book this set
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
