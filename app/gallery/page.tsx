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
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    alt: "Classic smash burger with melted cheese",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80",
    alt: "Loaded fries with melted cheese and bacon",
    aspect: "aspect-square", // Square
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80",
    alt: "Crispy chicken burger with coleslaw",
    aspect: "aspect-[16/9]", // Landscape
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
    alt: "Golden crispy onion rings",
    aspect: "aspect-[4/5]", // Tall Portrait
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    alt: "Juicy burger with fresh toppings",
    aspect: "aspect-[4/3]", // Wide Landscape
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1585297100016-9f49ab8c3c08?w=800&auto=format&fit=crop&q=80",
    alt: "Crispy chicken tenders with dipping sauce",
    aspect: "aspect-square", // Square
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=80",
    alt: "Burger meal deal with fries and drink",
    aspect: "aspect-[3/4]", // Portrait
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1752358332913-8f76c1c52602?w=800&auto=format&fit=crop&q=80",
    alt: "Selection of house-made dipping sauces",
    aspect: "aspect-[16/10]", // Landscape
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80",
    alt: "Hand-cut fries being prepared",
    aspect: "aspect-square", // Square
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&auto=format&fit=crop&q=80",
    alt: "Veggie burger with fresh vegetables",
    aspect: "aspect-[4/5]", // Tall Portrait
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80",
    alt: "Refreshing iced drinks selection",
    aspect: "aspect-[16/9]", // Landscape
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop&q=80",
    alt: "Restaurant interior with warm lighting",
    aspect: "aspect-[3/2]", // Landscape
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