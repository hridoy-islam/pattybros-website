import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import ActionBar from "@/components/public/ActionBar";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "About Zee, lash artist in Dartford",
  description:
    "Zee, the founder of LashesByZee, on how a childhood love of lashes became her own luxury lash studio near Dartford Station.",
};

export default function AboutPage() {
  return (
    <>
      <Header current="/about" />
      <main id="top">
        <PageHero
          title="Hi, I’m Zee, founder of LashesByZee"
          lead="A lash artist with her own studio, a short walk from Dartford Station."
          photo={{
            src: "/images/artist-at-work.jpg",
            alt: "A lash artist applying extensions with tweezers to a client lying back",
            pos: "50% 40%",
          }}
        />

        <section className="section" id="story" aria-labelledby="story-h">
          <div className="container grid items-start gap-10 md:grid-cols-2 md:gap-6">
            <div className="grid gap-5 md:pr-12">
              <h2 id="story-h" className="h2">
                A love of lashes since childhood
              </h2>
              <p className="lead">
                I&rsquo;ve had a passion for beauty and lashes from a very young age. I would always practise different
                lash looks on my mum and aunties, which helped me discover my love for lash artistry.
              </p>
              <p>
                Turning my passion into my own business has always been a dream of mine. I love creating beautiful lash
                sets, experimenting with different styles and helping others feel confident and beautiful.
              </p>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/artist-portrait-1.jpg"
                alt="A lash artist in a face mask working closely on a client's lashes by a sunny window"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="section" id="promise" aria-labelledby="promise-h">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="promise-h" className="h2">
                A personal lash appointment
              </h2>
              <Link href="/gallery" className="link-arrow">
                See the lash gallery
              </Link>
            </div>
            <div className="mt-10 grid items-start gap-6 md:grid-cols-12">
              <div className="grid gap-4 md:col-span-6 md:pr-12">
                <p className="lead">
                  I take pride in providing a professional, personalised experience, making sure every client feels
                  comfortable and leaves feeling their absolute best.
                </p>
                <p>
                  My goal is to grow LashesByZee into a successful luxury lash brand and continue doing what I love every
                  day. Thank you for being part of my journey.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-6 md:gap-6">
                <div className="aspect-square overflow-hidden">
                  <img src="/images/lash-tray-tweezers.jpg" alt="Fine tweezers on a tray of lash extensions" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-square overflow-hidden">
                  <img src="/images/set-hybrid.jpg" alt="A finished hybrid lash set on a hazel eye" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter close={{ title: "Book your first set with Zee", line: "New clients start with a free patch test." }} />
      <ActionBar />
    </>
  );
}
