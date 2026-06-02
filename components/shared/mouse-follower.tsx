"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/utils";

export function MouseFollower() {
  const [isVisible, setIsVisible] = useState(false);

  // 1. Motion Values for raw coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Spring Physics (Smooth trailing effect)
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Center the dot (subtract half width/height)
      cursorX.set(e.clientX - 8); 
      cursorY.set(e.clientY - 8);
      
      // Show cursor only after first movement
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full bg-primary mix-blend-difference lg:block hidden", 
        !isVisible && "opacity-0"
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
}