"use client";

import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let locomotiveScroll: any;

    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          duration: 1.5,
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 2,
          touchMultiplier: 2,
        },
      });

      // Stop Lenis from hijacking scroll inside modals/dropdowns
      const stopScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-lenis-prevent]')) {
          locomotiveScroll?.lenis?.stop?.();
          setTimeout(() => locomotiveScroll?.lenis?.start?.(), 300);
        }
      };

      window.addEventListener("wheel", stopScroll, { passive: true });
      window.addEventListener("touchmove", stopScroll, { passive: true });
    })();

    return () => {
      locomotiveScroll?.destroy();
    };
  }, []);

  return <>{children}</>;
}