"use client";

import Image from "next/image";

export default function GalleryInfoSection() {
  return (
    <section className="bg-white py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 gsap-fade-up">
        <div className="relative h-[350px]">
          <Image src="/gallery-1.jpg" alt="Restaurant Interior" fill className="object-cover" />
        </div>
        <div className="relative h-[350px]">
          <Image src="/gallery-2.jpg" alt="Toasting Glasses" fill className="object-cover" />
        </div>
        <div className="relative h-[350px]">
          <Image src="/gallery-3.jpg" alt="Table Setup" fill className="object-cover" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 gsap-fade-up">
            <div>
              {/* Changed to text-primary-foreground */}
              <p className="text-primary-foreground font-bold tracking-widest uppercase text-sm mb-2">
                --- FAQ ---
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-black leading-tight">
                Come to our restaurant, ready your food
              </h2>
            </div>
            
            {/* Changed to text-secondary */}
            <ul className="space-y-4 text-secondary text-sm font-medium">
              <li className="flex items-center gap-3">
                {/* Changed to text-primary-foreground */}
                <span className="text-primary-foreground">▶</span> 100% Fresh ingredients guaranteed
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary-foreground">▶</span> Fast delivery within 30 minutes
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary-foreground">▶</span> Quality certified by master chefs
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 gsap-fade-up">
             <div className="relative h-[200px] col-span-2">
                <Image src="/kitchen-prep.jpg" alt="Kitchen Prep" fill className="object-cover" />
             </div>
             {/* Changed to bg-primary-foreground */}
             <div className="bg-primary-foreground text-white p-6 flex flex-col justify-center">
                <h3 className="text-3xl font-black">24/7</h3>
                <p className="text-sm font-bold uppercase">Daily Customers</p>
             </div>
             <div className="relative h-[150px]">
                <Image src="/chef-smiling.jpg" alt="Happy Chef" fill className="object-cover" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}