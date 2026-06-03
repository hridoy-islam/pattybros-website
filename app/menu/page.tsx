"use client";

import React, { useEffect } from "react";
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

const menuData = [
  {
    category: "Beef Burgers",
    icon: Beef,
    imagePlaceholder: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Classic Smash", desc: "Potato Bun, Dry Aged Beef Burgers, Mature Cheddar, Bro's Sauce, Pickles, Diced Onion", price: "£10.50" },
      { name: "Bro's Special", desc: "Potato Bun, Dry Aged Beef Burgers, American Cheese, Smoked Bacon, Onion Ring, Bro's Sauce, Pickles, Diced Onion, Lollo Bionda Lettuce", price: "£11.50" },
      { name: "Honey Jalapeno Smash", desc: "Potato Bun, Dry Aged Beef Burgers, American Cheese, Hot Jalapeno Jam, Pickles, Diced Onion, Lollo Bionda Lettuce", price: "£11.50" }
    ]
  },
  {
    category: "Chicken Burgers",
    icon: Drumstick,
    imagePlaceholder: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Chicky Crunch Burger", desc: "Potato Bun, Free-range Chicken Fillet, American Cheese, Ranch Mayo, Pickles, Creamy Coleslaw, Lollo Bionda Lettuce", price: "£10.50" }
    ]
  },
  {
    category: "Veggie Burgers",
    icon: Leaf,
    imagePlaceholder: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Veggie Burger", desc: "Potato Bun, Veggie Patty, American Cheese (Veg), Kimchi, Pickle, Veggie Sauce, Lollo Bionda Lettuce", price: "£10.00" }
    ]
  },
  {
    category: "Loaded Fries",
    icon: Flame,
    imagePlaceholder: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Smashed Beef / Chopped Bacon / Chicky Crunch", desc: "Crispy Fries Layered with Choice of Your Meat, Rich Melted Cheese, Chopped Pickles, and Bro's sauce", price: "£8.00" },
      { name: "Cheesy Fries", desc: "Crispy Fries Smothered in Rich Melted Cheese", price: "£5.50" }
    ]
  },
  {
    category: "Sides",
    icon: Sparkles,
    imagePlaceholder: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Fries", desc: "Crispy golden sea-salted fries", price: "£4.00" },
      { name: "Sweet Potato Fries", desc: "Sweet & crunchy premium potato fries", price: "£4.50" },
      { name: "Onion Rings", desc: "Crispy battered golden onion rings", price: "£4.00" }
    ]
  },
  {
    category: "Dips",
    icon: Heart,
    imagePlaceholder: "https://images.unsplash.com/photo-1752358332913-8f76c1c52602?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    items: [
      { name: "Bro's Sauce", desc: "Our signature house burger sauce", price: "£1.00" },
      { name: "Ranch Mayo", desc: "Creamy herbed garlic mayonnaise", price: "£1.00" },
      { name: "Ketchup", desc: "Classic rich tomato ketchup", price: "£1.00" },
      { name: "Mayo", desc: "Thick and creamy standard mayonnaise", price: "£1.00" },
      { name: "Mustard", desc: "Tangy traditional yellow mustard", price: "£1.00" }
    ]
  },
  {
    category: "Drinks",
    icon: Sparkles,
    imagePlaceholder: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Chilled Soft Drinks", desc: "Selection of refreshing ice-cold beverages", price: "£2.00" }
    ]
  },
  {
    category: "Add Ons",
    icon: Plus,
    imagePlaceholder: "https://images.unsplash.com/photo-1585297100016-9f49ab8c3c08?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    items: [
      { name: "Extra Beef / Chicken", desc: "Stack up your meal with an extra premium protein portion", price: "£2.50" }
    ]
  },
  {
    category: "Meal Deals & Bundles",
    icon: Award,
    imagePlaceholder: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80",
    items: [
      { name: "Meal Deal", desc: "Any Burger + Fries + Drink", price: "£14.00" },
      { name: "Kids Meal", desc: "Single Patty Burger + Fries", price: "£8.50" }
    ]
  }
];

export default function MenuPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
        <div className="container mx-auto  py-24">
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

          {/* Categories Loop */}
          <div className="space-y-24">
            {menuData.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.03, ease: "easeOut" }}
                // ✅ No willChange — Framer Motion handles compositing internally
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <section.icon className="w-6 h-6 text-red-600" />
                  </div>
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
                    // ✅ Plain div — CSS-only hover, no Framer Motion transform conflict
                    <div
                      key={item.name}
                      className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100/80 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-md"
                    >
                      {/* Product Image */}
                      <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                        <Image
                          src={section.imagePlaceholder}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 112px"
                          // ✅ No will-change-transform — avoids stacking context conflict with hover translate
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full py-1">
                        <div>
                          <div className="flex items-baseline justify-between gap-4 mb-1">
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

          {/* Footer */}
          <div className="mt-16 text-center text-xs md:text-sm  border-t border-zinc-100 pt-12 max-w-4xl mx-auto space-y-1 font-medium">
            <h4>All prices include VAT. Menu items may contain allergens.</h4>
            <h4>Please inform our staff members of any specific dietary requirements.</h4>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}