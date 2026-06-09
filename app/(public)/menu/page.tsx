"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Flame, 
  Sparkles, 
  Award, 
  Clock, 
  Beef, 
  Drumstick, 
  Leaf, 
  ArrowUpRight, 
  Heart, 
  Plus 
} from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios"; 
import { BlinkingDots } from "@/components/ui/blinking-dots";

// --- TypeScript Interfaces matching your real API structure ---
interface Category {
  _id: string;
  CategoryName: string; // Capitalized C matching your JSON
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AddOnItem {
  title: string;
  price: number;
  _id: string;
}

interface ApiMenuItem {
  _id: string;
  title: string; // API uses title instead of name
  ingredientItem: string[];
  addOnItems: AddOnItem[];
  price: number;
  categoryId: Category;
  createdAt: string;
  updatedAt: string;
  image: string;
}

interface TransformedMenuItem {
  name: string;
  desc: string; // Receives the comma-separated ingredientItem
  price: string;
  image: string; // Added field to store individual item images
}

interface TransformedMenuSection {
  category: string;
  icon: React.ComponentType<any>;
  imagePlaceholder: string;
  items: TransformedMenuItem[];
}

// Icon mapper matching dynamic category names
const iconMap: Record<string, React.ComponentType<any>> = {
  "Burger": Beef,
  "Beef Burgers": Beef,
  "Chicken Burgers": Drumstick,
  "Veggie Burgers": Leaf,
  "Loaded Fries": Flame,
  "Sides": Sparkles,
  "Dips": Heart,
  "Drinks": Sparkles,
  "Add Ons": Plus,
  "Meal Deals & Bundles": Award,
};

// Fallback high-quality images if image string is empty from the API
const dynamicFallbackImages: Record<string, string> = {
  "Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  "Beef Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  "Chicken Burgers": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
  "Veggie Burgers": "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600&auto=format&fit=crop&q=80",
  "Loaded Fries": "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
  "Sides": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
  "Dips": "https://images.unsplash.com/photo-1752358332913-8f76c1c52602?q=80&w=1170&auto=format&fit=crop&q=80",
  "Drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
};

export default function MenuPage() {
  const [menuData, setMenuData] = useState<TransformedMenuSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/menu?limit=all&status=active");
        
        // Safely extract from response.data.data.result matching your payload layout
        const rawItems: ApiMenuItem[] = response.data?.data?.result || [];

        const groupedData: Record<string, TransformedMenuSection> = {};

        rawItems.forEach((item) => {
          // Extract using CategoryName from the object
          const categoryName = item.categoryId?.CategoryName || "Other";
          
          // Flatten ingredients array into a single comma-joined string
          const ingredientsString = Array.isArray(item.ingredientItem)
            ? item.ingredientItem.join(", ")
            : "";

          // Formats price safely adding currency sign
          const formattedPrice = `£${Number(item.price).toFixed(2)}`;

          // Find specific placeholder for this item's category
          const fallbackImg = dynamicFallbackImages[categoryName] || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";

          // Formats localized item layout configuration with its own explicit image fallback handler
          const transformedItem: TransformedMenuItem = {
            name: item.title, // maps API 'title' field
            desc: ingredientsString, // maps ingredients list directly here
            price: formattedPrice,
            image: item.image ? item.image : fallbackImg, // Dynamic image field specific to this item
          };

          if (!groupedData[categoryName]) {
            groupedData[categoryName] = {
              category: categoryName,
              icon: iconMap[categoryName] || Sparkles,
              imagePlaceholder: fallbackImg,
              items: [],
            };
          }

          groupedData[categoryName].items.push(transformedItem);
        });

        setMenuData(Object.values(groupedData));
      } catch (err: any) {
        console.error("Error loading menu:", err);
        setError("Failed to load menu selections. Please verify connection or try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <SmoothScroll>
      <Hero
        title="Our Menu"
        subtitle="Smashed with passion. Made for purists."
      />

      <section className="bg-white border-b border-zinc-200/60 py-12">
        <div className="container mx-auto">
          <div className="bg-zinc-950 text-white p-8 md:p-12 rounded-sm border border-zinc-800 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,33,39,0.15),transparent_60%)] pointer-events-none" />

            <div className="space-y-3 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                <Clock className="w-3 h-3" /> <h4>Skip the Waiting Line</h4>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight scale-y-105 origin-left">
                CLICK & COLLECT
              </h2>
              <h4 className="text-zinc-100 text-xs md:text-sm leading-relaxed font-medium">
                Fresh smash burgers ready for pickup. Order online in minutes, choose your preferred custom pickup schedule, and collect hot directly from our shop pass counter.
              </h4>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto">
              <Button className="inline-flex items-center justify-center py-6 tracking-widest rounded-full px-8 shadow-lg transition-all w-full md:w-auto text-center text-md bg-red-600 hover:bg-red-700 text-white border-none">
                Order Now <ArrowUpRight className="w-4 h-4 ml-1.5 stroke-[2.5]" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Menu Grid Container */}
      <div className="bg-white text-zinc-900 min-h-screen">
        <div className="container mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center pb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-primary-foreground uppercase tracking-tight">
              Our Menu
            </h1>
            <h4 className="text-zinc-600 text-lg max-w-5xl mx-auto font-medium">
              Every burger smashed to order. Every fry golden-crisp. Every sauce made to satisfy.
            </h4>
          </motion.div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-12">
              <BlinkingDots/>
            </div>
          )}

          {/* Error Message banner fallback */}
          {error && (
            <div className="text-center py-12 text-red-600 font-bold">
              <p>{error}</p>
            </div>
          )}

          {/* Dynamic Categories Loop Grid */}
          {!loading && !error && (
            <div className="space-y-24">
              {menuData.map((section, sectionIndex) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.03, ease: "easeOut" }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900">
                        {section.category}
                      </h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 to-transparent ml-4" />
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100/80 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-md"
                      >
                        {/* Product Image - Now loads individual item.image dynamically */}
                        <div className="relative w-full sm:w-44 h-44 sm:h-44 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 144px"
                            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                        </div>

                        {/* Info Element Wrapper */}
                        <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full py-1">
                          <div>
                            <div className="flex items-baseline justify-between gap-4 mb-1.5">
                              <h3 className="text-lg font-extrabold text-zinc-900 transition-colors duration-200 group-hover:text-red-600 line-clamp-2">
                                {item.name}
                              </h3>
                              <h3 className="text-lg font-black text-red-600 whitespace-nowrap">
                                {item.price}
                              </h3>
                            </div>
                            <h4 className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-3">
                              {item.desc}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer Text */}
          <div className="mt-16 text-center text-xs md:text-sm border-t border-zinc-100 pt-12 max-w-4xl mx-auto space-y-1 font-medium">
            <h4>All prices include VAT. Menu items may contain allergens.</h4>
            <h4>Please inform our staff members of any specific dietary requirements.</h4>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}