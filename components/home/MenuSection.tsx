"use client";

import Image from "next/image";

const MENU_ITEMS = [
  { name: "Mushroom Burger", price: "$49", desc: "Served with delicious natural ingredients and special cheese." },
  { name: "Double Beef Mac", price: "$65", desc: "Double the beef, double the flavor with our signature sauce." },
  { name: "Vegan Burger", price: "$32", desc: "Plant-based patty with fresh organic veggies." },
  { name: "Local Burger", price: "$40", desc: "A classic taste using the finest local ingredients." },
];

export default function MenuSection() {
  return (
    <section className="bg-background text-white py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 space-y-4 gsap-fade-up">
          {/* Changed to text-primary */}
          <p className="text-primary font-bold tracking-widest uppercase text-sm">
            --- Menu List ---
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase">
            We Offer People Best Way
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] w-full rounded-lg overflow-hidden gsap-fade-up">
            <Image src="/chef-making-burger.jpg" alt="Chef preparing food" fill className="object-cover" />
          </div>

          <div className="space-y-10">
            {MENU_ITEMS.map((item, index) => (
              <div key={index} className="gsap-fade-up">
                <div className="flex items-end justify-between mb-2">
                  <h3 className="text-xl font-bold uppercase text-white">{item.name}</h3>
                  <div className="flex-grow border-b-2 border-dotted border-gray-600 mx-4 relative top-[-6px]"></div>
                  {/* Changed to text-primary */}
                  <span className="text-2xl font-black text-primary">{item.price}</span>
                </div>
                {/* Changed to text-secondary */}
                <p className="text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}