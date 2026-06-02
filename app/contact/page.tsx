import { ContactSection } from "@/components/home/contact-section";
import { Hero } from "@/components/shared/Hero";
import { MouseFollower } from "@/components/shared/mouse-follower";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { contactContent } from "@/utils/content";

export default function ContactPage() {
    const { title, subtitle } = contactContent.hero;
  
  return (
    <SmoothScroll>
      <MouseFollower />
      <Hero title={title} subtitle={subtitle} />

 
        <ContactSection />
    
    </SmoothScroll>
  );
}
