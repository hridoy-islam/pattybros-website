import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import ActionBar from "@/components/public/ActionBar";
import PageHero from "@/components/public/PageHero";
import SetTiles from "@/components/services/SetTiles";
import Aftercare from "@/components/services/Aftercare";

export default function ServicesPage() {
  return (
    <>
      <Header current="/services" />
      <main id="top">
        <PageHero
          title="Lash extensions and prices"
          lead="Six full sets, infills and removal, each set designed for your eye shape."
          photo={{
            src: "/images/lash-application-closeup.jpg",
            alt: "Extensions being placed one by one with fine tweezers on a client's lower lid pad",
            pos: "50% 40%",
          }}
        />
        <SetTiles />
        <Aftercare />
      </main>
      <SiteFooter close={{ title: "Choose your set and book", line: "A £15 deposit holds your time and comes off the price." }} />
      <ActionBar />
    </>
  );
}
