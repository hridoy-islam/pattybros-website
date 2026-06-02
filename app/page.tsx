import { homeContent } from "@/utils/content";

import SmoothScroll from "@/components/shared/smooth-scroll";
import Hero from "@/components/home/hero";
import AboutStats from "@/components/home/AboutStats";
import ChefSection from "@/components/home/ChefSection";
import GalleryInfoSection from "@/components/home/GalleryInfoSection";
import MenuSection from "@/components/home/MenuSection";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="flex flex-col min-h-screen">
        <Hero />
        <AboutStats/>
        <MenuSection />
        <GalleryInfoSection />
      </main>
    </SmoothScroll>
  );
}