"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ChefSection() {
  return (
    <section className="bg-[#f9f9f9] text-black py-24">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          <div className="space-y-6 lg:col-span-1 gsap-fade-up">
            {/* Changed to text-primary-foreground */}
            <p className="text-primary-foreground font-bold tracking-widest uppercase text-sm">
              --- Our Team ---
            </p>
            <h2 className="text-4xl font-black uppercase leading-tight">
              Meet With Our Chef
            </h2>
            {/* Changed to text-secondary */}
            <p className="text-secondary text-sm">
              Our master chefs bring years of culinary expertise, blending tradition with modern techniques to craft unforgettable dining experiences.
            </p>
            {/* Changed to bg-primary-foreground */}
            <Button className="bg-primary-foreground hover:bg-black text-white px-8 py-6 rounded-full text-sm font-bold uppercase transition-colors mt-4">
              View More
            </Button>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { name: "John Doe", role: "Head Chef", img: "/chef-1.jpg" },
              { name: "Jane Smith", role: "Sous Chef", img: "/chef-2.jpg" }
            ].map((chef, i) => (
              <div key={i} className="group relative overflow-hidden rounded-sm gsap-fade-up">
                <div className="relative h-[400px] w-full">
                  <Image src={chef.img} alt={chef.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute bottom-0 left-0 bg-white p-4 w-3/4">
                  <h3 className="font-black uppercase text-lg">{chef.name}</h3>
                  {/* Changed to text-secondary */}
                  <p className="text-secondary text-xs uppercase font-bold">{chef.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}