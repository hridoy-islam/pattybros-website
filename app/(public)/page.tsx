import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import ActionBar from "@/components/public/ActionBar";
import Hero from "@/components/home/Hero";
import Visit from "@/components/home/Visit";
import PopularSets from "@/components/home/PopularSets";
import Welcome from "@/components/home/Welcome";
import MeetZee from "@/components/home/MeetZee";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Visit />
        <PopularSets />
        <Welcome />
        <MeetZee />
      </main>
      <SiteFooter close={{ title: "Book your lash appointment", line: "Full sets from £45. A £15 deposit holds your time." }} />
      <ActionBar />
    </>
  );
}
