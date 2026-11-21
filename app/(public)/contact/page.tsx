import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import ActionBar from "@/components/public/ActionBar";
import PageHero from "@/components/public/PageHero";
import Hours from "@/components/public/Hours";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact LashesByZee in Dartford",
  description: "Send Zee a message, find the studio near Dartford Station and see the opening hours.",
};

export default function ContactPage() {
  return (
    <>
      <Header current="/contact" />
      <main id="top">
        <PageHero
          title="Contact the studio in Dartford"
          lead="Questions about a set or a booking? Zee replies within a day."
          // Stand-in photograph (Jameswasswa, CC BY-SA 4.0, credited in the footer) until Zee's own is shot
          photo={{
            src: "/images/contact-lash-placement.jpg",
            alt: "A lash artist holding two pairs of tweezers to place an extension on a client's closed eye",
            pos: "50% 40%",
          }}
          action={{ href: "#message", label: "Send a message" }}
        />

        <section className="section scroll-mt-20" id="message" aria-labelledby="message-h">
          <div className="container grid items-start gap-10 md:grid-cols-2 md:gap-6">
            <div className="grid gap-6 md:pr-12">
              <h2 id="message-h" className="h2">
                Send Zee a message
              </h2>
              <p>
                For bookings, the quickest way is online.{" "}
                <Link href="/booking" className="link-arrow">
                  Book an appointment
                </Link>
              </p>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[13px] font-medium text-primary-dark">Studio</p>
                  <address className="mt-3 text-lg not-italic leading-relaxed">
                    {site.areaLine}
                    <br />
                    {site.area}
                  </address>
                  <a href={site.mapUrl} className="link-arrow mt-3">
                    See the area
                  </a>
                  {site.instagramUrl ? (
                    <a href={site.instagramUrl} className="link-arrow mt-3">
                      Follow on Instagram
                    </a>
                  ) : null}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-primary-dark">Opening hours</p>
                  <Hours className="mt-3" />
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter close={{ title: "Ready for your lashes?", line: "Full sets from £45. A £15 deposit holds your time." }} />
      <ActionBar />
    </>
  );
}
