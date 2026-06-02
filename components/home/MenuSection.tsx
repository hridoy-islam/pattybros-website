"use client";

import Image from "next/image";

const MENU_ITEMS = [
  { 
    name: "Classic Smash", 
    price: "£10.50", 
    desc: "Potato Bun, Dry Aged Beef Patties, Mature Cheddar, Pickles, Bro's Sauce." 
  },
  { 
    name: "Double Beef Mac", 
    price: "£12.50", 
    desc: "Double dry aged beef, double cheddar, shredded lettuce, and house signature sauce." 
  },
  { 
    name: "The Green Smash", 
    price: "£9.50", 
    desc: "Plant-based smash patty, vegan cheddar style slice, fresh organic veggies." 
  },
  { 
    name: "Truffle Loaded Fries", 
    price: "£6.50", 
    desc: "Skin-on rustic fries drenched in luxurious black truffle mayo and fresh chives." 
  },
];

export default function MenuSection() {
  return (
    <section className="relative bg-background text-white py-24 overflow-hidden">
      {/* Background Pattern Layer */}
      <div className="absolute inset-0 z-0">
        {/* Diagonal line pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #ffffff 0px,
              #ffffff 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Large decorative circles */}
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full border border-primary/5" />
        <div className="absolute top-40 -right-16 w-80 h-80 rounded-full border border-primary/5" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border border-primary/5" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 gsap-fade-up">
          <div className="flex items-center justify-center gap-2 text-primary-foreground font-bold tracking-widest uppercase text-xs">
            <span className="w-7 h-[2px] bg-primary-foreground"></span>
            <h4>
              Menu List
            </h4>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase">
            We Offer People Best Way
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[300px] md:h-[800px] rounded-md w-full overflow-hidden gsap-fade-up">
            <Image src="/chef-making-burger.jpg" alt="Chef preparing food" fill className="object-cover " />
          </div>

          <div className="space-y-20">
            {MENU_ITEMS.map((item, index) => (
              <div key={index} className="gsap-fade-up">
                <div className="flex items-end justify-between mb-2">
                  <h3 className="text-lg font-bold uppercase text-white">{item.name}</h3>
                  <div className="flex-grow border-b-2 border-dotted border-gray-600 mx-4 relative top-[-14px]"></div>
                  <span className="text-2xl font-black text-primary"><h3>{item.price}</h3></span>
                </div>
                {/* Changed to text-secondary */}
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}