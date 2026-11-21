import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import ActionBar from "@/components/public/ActionBar";
import PageHero from "@/components/public/PageHero";
import SetChapters from "@/components/gallery/SetChapters";
import BeforeAfter, { type BeforeAfterPair } from "@/components/gallery/BeforeAfter";
import VideoClips, { type Clip } from "@/components/gallery/VideoClips";

export const metadata: Metadata = {
  title: "Lash gallery: before and after, sets, close-ups and videos",
  description: "Before and after pictures, classic, hybrid, Russian volume and wispy lash sets, close-ups and short videos from LashesByZee in Dartford, Kent.",
};

// Stand-in photographs until Zee's own work is shot: swap each src for her photographs in /public/images.
const styles = [
  {
    src: "/images/set-classic.jpg",
    alt: "A blue eye with long, separated classic lash extensions",
    title: "Classic sets",
    text: "One extension on each natural lash: longer, darker and evenly curled, for an everyday natural look.",
    id: "classic",
  },
  {
    src: "/images/set-hybrid.jpg",
    alt: "A hazel eye with soft, textured hybrid lashes",
    title: "Hybrid sets",
    text: "Classic lashes mixed with light fans, for more fullness than a classic set with a soft, textured line.",
    id: "hybrid",
  },
  {
    src: "/images/set-russian-volume.jpg",
    alt: "A brown eye with full, dark Russian volume lashes",
    title: "Russian volume sets",
    text: "Handmade fans of three to six fine lashes on each natural lash, for a dark, full and fluffy finish.",
    id: "russian-volume",
  },
  {
    src: "/images/set-wispy.jpg",
    alt: "A green eye with long, wispy lashes in warm light",
    title: "Wispy sets",
    text: "Longer spikes set between softer fans, for a fluttery, textured line that photographs beautifully.",
    id: "wispy",
  },
];

// Stand-in pairs (different people): replace with Zee's own before and after photographs of one client.
const pairs: BeforeAfterPair[] = [
  {
    title: "Russian volume set",
    before: { src: "/images/before-open-eye.jpg", alt: "A brown eye with short, sparse natural lashes" },
    after: { src: "/images/eye-warm-1.jpg", alt: "A brown eye with long, dark, curled lash extensions" },
  },
  {
    title: "Mega volume set",
    before: { src: "/images/before-side-eye.jpg", alt: "Side view of an eye with fine natural lashes", pos: "30% 50%" },
    after: { src: "/images/set-mega-volume.jpg", alt: "Side view of an eye with very full, dark mega volume lashes" },
  },
  {
    title: "Statement set",
    before: { src: "/images/before-closed-eye.jpg", alt: "A closed eye with natural, uncurled lashes" },
    after: { src: "/images/set-anime.jpg", alt: "Eyes looking down, wearing long, glittering statement lashes" },
  },
];

const closeUps = [
  { src: "/images/tweezers-application.jpg", alt: "Two pairs of tweezers placing extensions on a closed eye" },
  { src: "/images/lash-application-closeup.jpg", alt: "Extensions being placed one by one on a client's lashes" },
  { src: "/images/eye-warm-2.jpg", alt: "A blue eye with long, dark lash extensions in warm light" },
  { src: "/images/eye-warm-3.jpg", alt: "An eye with soft, natural lash extensions in warm light" },
];

// Short videos: add each clip to /public/videos and set its src; the poster shows until then.
const clips: Clip[] = [
  { poster: "/images/artist-portrait-1.jpg", label: "Zee placing lash extensions on a client" },
  { poster: "/images/artist-at-work.jpg", label: "Lash extensions being mapped and placed" },
  { poster: "/images/lash-tray-tweezers.jpg", label: "A tray of lash fans and tweezers ready for a set" },
];

export default function GalleryPage() {
  return (
    <>
      <Header current="/gallery" />
      <main id="top">
        <PageHero
          title="Lash gallery: sets and close-ups"
          lead="Before and after pictures, classic, hybrid, Russian volume and wispy sets, close-ups and short videos."
          photo={{
            src: "/images/hero-lash-application.jpg",
            alt: "A lash artist placing extensions with fine tweezers on a client with her eyes closed",
            pos: "50% 45%",
          }}
        />

        <BeforeAfter pairs={pairs} />

        <SetChapters sets={styles} />

        <section className="section" id="close-ups" aria-labelledby="close-h2">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="close-h2" className="h2">
                Close-ups of the work
              </h2>
              <Link href="/services" className="link-arrow">
                See the sets and prices
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-0.5 md:grid-cols-4">
              {closeUps.map((p) => (
                <figure key={p.src} className="group aspect-square overflow-hidden">
                  <img src={p.src} alt={p.alt} loading="lazy" className="zoom-img" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <VideoClips clips={clips} />
      </main>
      <SiteFooter close={{ title: "Love a look? Book it", line: "Tell Zee which style you like when you book." }} />
      <ActionBar />
    </>
  );
}
