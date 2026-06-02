import { ServicesHero } from "@/components/services/services-hero";
import { ServiceSplitSection } from "@/components/services/service-split-section";
import { WorkingProcess } from "@/components/services/working-process";
import { FaqsSection } from "@/components/services/faqs-section";
import { ContactSection } from "@/components/home/contact-section";
import { servicesContent } from "@/utils/content";
import { Hero } from "@/components/shared/Hero";
import { MouseFollower } from "@/components/shared/mouse-follower";
import SmoothScroll from "@/components/shared/smooth-scroll";

export default function ServicesPage() {
  const { title, subtitle } = servicesContent.hero;

  return (
     <SmoothScroll>
          <MouseFollower />
      <Hero title={title} subtitle={subtitle} />

      {servicesContent.sections.map((section) => (
        <ServiceSplitSection key={section.id} {...section} />
      ))}
      <WorkingProcess />
      <FaqsSection />
    </SmoothScroll>
  );
}
