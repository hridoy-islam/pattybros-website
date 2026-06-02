"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Flame, Sparkles, Award, ChefHat, Heart, Clock, Beef, Drumstick, Leaf, ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";

const menuData = [
  {
    category: "Beef Burgers",
    icon: Beef,
    items: [
      { name: "Classic Smash", desc: "Dry-aged beef, cheddar, pickles, bro's sauce", price: "£10.50" },
      { name: "Double Smash", desc: "Two patties, double cheese, caramelized onions", price: "£13.50" },
      { name: "Bacon Smash", desc: "Beef patty, crispy bacon, aged cheddar, smoky sauce", price: "£12.50" },
      { name: "Spicy Smash", desc: "Jalapeños, pepper jack, sriracha mayo", price: "£11.50" }
    ]
  },
  {
    category: "Chicken Burgers",
    icon: Drumstick,
    items: [
      { name: "Crispy Chicken", desc: "Buttermilk fried, slaw, chipotle mayo", price: "£11.00" },
      { name: "Spicy Chicken", desc: "Nashville hot, cooling ranch, pickles", price: "£12.00" },
      { name: "Grilled Chicken", desc: "Herb-marinated, avocado, honey mustard", price: "£11.50" }
    ]
  },
  {
    category: "Veggie Burgers",
    icon: Leaf,
    items: [
      { name: "Beyond Smash", desc: "Beyond Meat patty, vegan cheese, vegan sauce", price: "£11.50" },
      { name: "Portobello Stack", desc: "Grilled portobello, roasted peppers, pesto", price: "£10.50" }
    ]
  },
  {
    category: "Loaded Fries",
    icon: Flame,
    items: [
      { name: "Smash Fries", desc: "Beef crumble, cheese sauce, signature sauce", price: "£8.50" },
      { name: "Truffle Fries", desc: "Parmesan, truffle oil, garlic aioli", price: "£7.50" },
      { name: "Chilli Cheese", desc: "Beef chilli, cheese sauce, jalapeños", price: "£9.00" }
    ]
  },
  {
    category: "Sides",
    icon: Sparkles,
    items: [
      { name: "Hand-Cut Fries", desc: "Triple-cooked, sea salt", price: "£4.50" },
      { name: "Onion Rings", desc: "Beer-battered, ranch dip", price: "£5.50" },
      { name: "Coleslaw", desc: "Fresh & crunchy, secret dressing", price: "£3.50" }
    ]
  },
  {
    category: "Dips & Sauces",
    icon: Heart,
    items: [
      { name: "Bro's Sauce", desc: "Signature burger sauce", price: "£1.00" },
      { name: "Chipotle Mayo", desc: "Smoky, spicy, creamy", price: "£1.00" },
      { name: "Garlic Aioli", desc: "Roasted garlic mayo", price: "£1.00" }
    ]
  },
  {
    category: "Drinks",
    icon: Sparkles,
    items: [
      { name: "Craft Soda", desc: "Cola, Lemonade, Ginger Beer", price: "£3.50" },
      { name: "Milkshake", desc: "Vanilla, Chocolate, Strawberry", price: "£5.50" },
      { name: "Craft Beer", desc: "Local Lager, IPA, Pale Ale", price: "£5.00" }
    ]
  },
  {
    category: "Meal Deals",
    icon: Award,
    items: [
      { name: "Burger Deal", desc: "Any burger + fries + drink", price: "£14.00" },
      { name: "Double Up", desc: "2 burgers + 2 fries + 2 drinks", price: "£25.00" },
      { name: "Kids Meal", desc: "Small burger + fries + juice + toy", price: "£7.50" }
    ]
  }
];

export default function MenuPage() {
  return (
    <SmoothScroll>
      <Hero 
        title="Our Menu" 
        subtitle="Smashed with passion. Made for purists." 
      />
      
      <section className="bg-zinc-50 border-b border-zinc-200/60 py-12">
          <div className="container ">
            <div className="bg-zinc-950 text-white p-8 md:p-12 rounded-sm border border-zinc-800 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              {/* Decorative radial brand glow underlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,33,39,0.15),transparent_60%)] pointer-events-none" />
              
              <div className="space-y-3 relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <Clock className="w-3 h-3" /> <h4>Skip the Waiting Line</h4>
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight scale-y-105 origin-left">
                  CLICK & COLLECT
                </h2>
                <h4 className="text-zinc-200 text-xs md:text-sm leading-relaxed font-medium">
                  Fresh smash burgers ready for pickup. Order online in minutes, choose your preferred custom pickup target schedule, and collect hot directly from our shop pass counter.
                </h4>
              </div>

              <div className="shrink-0 relative z-10 w-full md:w-auto">
                <Button
                  className="inline-flex items-center justify-center py-8 tracking-widest rounded-full px-8 shadow-lgtransition-all w-full md:w-auto text-center text-lg"
                >
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-16"
          >
          
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-zinc-950">
               <span className="text-primary-foreground">Our Menu</span>
            </h1>
            <h4 className="text-zinc-700 text-lg max-w-5xl mx-auto">
              Every burger smashed to order. Every fry hand-cut. Every sauce made in-house.
            </h4>
          </motion.div>

          {/* Categories Loop */}
          <div className="space-y-24">
            {menuData.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">{section.category}</h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 to-transparent ml-4" />
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="group flex items-center justify-between p-5 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary-foreground transition-colors mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-zinc-500 ">
                          {item.desc}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="text-lg font-bold text-primary-foreground whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          

          {/* Footer Note */}
          <div className="mt-16 text-center text-sm text-zinc-500">
            <p>All prices include VAT. Menu items may contain allergens.</p>
            <p className="mt-1">Please inform staff of any dietary requirements.</p>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}