import { AboutHero } from "@/components/about/about-hero";
import { AboutCompanyIntro } from "@/components/about/about-company-intro";
import { AboutStrategiesCta } from "@/components/about/about-strategies-cta";
import { AboutFeaturesGrid } from "@/components/about/about-features-grid";
import { ContactSection } from "@/components/home/contact-section";
import { Hero } from "@/components/shared/Hero";
import { aboutContent } from "@/utils/content";
import { MouseFollower } from "@/components/shared/mouse-follower";
import SmoothScroll from "@/components/shared/smooth-scroll";

export default function AboutPage() {
  const { title, subtitle } = aboutContent.hero;

  return (
    <SmoothScroll>
      <MouseFollower />
      <Hero title={title} subtitle={subtitle} />
      <AboutCompanyIntro />
      <AboutStrategiesCta />
      <AboutFeaturesGrid />
    </SmoothScroll>
  );
}
