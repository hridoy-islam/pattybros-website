"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera, ArrowUpRight, Instagram } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Added specific aspect-ratio classes to simulate an editorial, aesthetic masonry mix
const galleryImages = [
  {
    id: 1,
    src: "/about-burger.jpg",
    alt: "Customer holding a freshly made Patty Bro's burger",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 2,
    src: "/Beef Puck.jpg", // Note: Change to /beef-puck.jpg if you rename files to remove spaces
    alt: "Freshly prepared raw beef patties ready for the smash grill",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 3,
    src: "/home1.jpg",
    alt: "Classic smash burger with melted cheese held in hand",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 4,
    src: "/home2.jpg",
    alt: "Chef assembling a gourmet burger with fresh ingredients",
    aspect: "aspect-square", // Square
  },
  {
    id: 5,
    src: "/home3.jpg",
    alt: "Double stacked smash burger with dripping cheese layers",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 6,
    src: "/home4.jpg",
    alt: "Gourmet beef burger served with a side of golden crispy fries",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 7,
    src: "/home5.jpg",
    alt: "Juicy burger with fresh lettuce and tomato with a drink side",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 8,
    src: "/home6.jpg",
    alt: "Patty Bro's chef preparing smash burgers on a commercial flat-top grill",
    aspect: "aspect-square", // Square
  },
  {
    id: 9,
    src: "/home7.jpg",
    alt: "Burger meal spread and refreshing drinks on a wooden table",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 10,
    src: "/IMG_8065.jpg",
    alt: "Premium seasoned beef pucks aligned on a prep surface",
    aspect: "aspect-[16/9]", // Landscape
  },
  {
    id: 11,
    src: "/jelapenos.jpg",
    alt: "Fresh sliced and whole green jalapeno peppers for burger toppings",
    aspect: "aspect-[16/9]", // Landscape
  },
  {
    id: 12,
    src: "/Table setup 2.jpg",
    alt: "Patty Bro's interior restaurant dining area and bench seating",
    aspect: "aspect-[16/9]", // Landscape
  },
  {
    id: 13,
    src: "/Table setup.jpg",
    alt: "Cozy indoor restaurant seating arrangement with warm ambient lighting",
    aspect: "aspect-[16/9]", // Landscape
  },
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const router = useRouter();
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const navigateImage = (direction: "prev" | "next") => {
    setCurrentImageIndex((prev) => {
      if (direction === "prev") return prev === 0 ? galleryImages.length - 1 : prev - 1;
      return prev === galleryImages.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateImage("prev");
      if (e.key === "ArrowRight") navigateImage("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothScroll>
      <Hero
        title="Our Gallery"
        subtitle="A taste of what we craft. Every bite tells a story of passion and flavour."
      />

      {/* Main Gallery Grid */}
      <div className="bg-white text-zinc-900 min-h-screen">
        <div className="container mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center pb-16"
          >

            <h1 className="text-3xl md:text-7xl font-black mb-6 text-primary-foreground uppercase tracking-tight">
              The Gallery
            </h1>
            <h4 className="text-zinc-800 text-sm max-w-5xl mx-auto font-medium leading-relaxed">
              From the first smash on the grill to the final drizzle of sauce — every moment is crafted with care.
            </h4>
          </motion.div>

          {/* Masonry-style Grid with fluid aspect variations */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
                className="break-inside-avoid"
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openLightbox(index)}
              >
                <div className="relative group cursor-pointer rounded-2xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-xl transition-shadow duration-500">
                  {/* Dynamic aspect ratio mapping injected cleanly here */}
                  <div className={`relative w-full ${image.aspect}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent transition-opacity duration-300 flex items-end p-5 ${
                        hoveredId === image.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="text-white">
                        <h3 className="text-sm font-semibold leading-snug">{image.alt}</h3>
                      </div>
                    </div>
                    {/* Zoom Icon */}
                    <div
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        hoveredId === image.id
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                      }`}
                    >
                      <Camera className="w-4 h-4 text-zinc-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              className="absolute left-4 md:left-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              className="absolute right-4 md:right-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Box */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-4xl max-h-[85vh] w-full h-full rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[currentImageIndex]?.src}
                alt={galleryImages[currentImageIndex]?.alt}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                priority
              />
              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/90 to-transparent p-6 pt-20">
                <h3 className="text-white text-sm font-semibold">
                  {galleryImages[currentImageIndex]?.alt}
                </h3>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-white to-zinc-50 border-t border-zinc-100 py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-zinc-950 text-white p-10 md:p-16 rounded-3xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.2),transparent_60%)] pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
                  <Instagram className="w-3 h-3" /> <h3>Stay Hungry</h3>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                  Craving the Real Deal?
                </h2>
                <h4 className="text-zinc-300 text-base leading-relaxed font-medium">
                  You've seen the shots. Now taste the legend. Order your favourites online and skip the queue, or visit us in-store for the full Bro's experience. Fresh, smashed, and unforgettable.
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button onClick={() => router.push("/takeaway")} className="inline-flex items-center justify-center py-8 px-10 rounded-full font-black uppercase tracking-widest text-sm bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-600/20 transition-all hover:shadow-red-600/40">
                  Order Online <ArrowUpRight className="w-4 h-4 ml-1.5 stroke-[2.5]" />
                </Button>
                <Button onClick={() => router.push("/menu")} className="inline-flex items-center justify-center py-8 px-10 rounded-full font-black uppercase tracking-widest text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all">
                  Our Menu
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SmoothScroll>
  );
}