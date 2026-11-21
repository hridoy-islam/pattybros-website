import type { Metadata } from "next";
import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import PageHero from "@/components/public/PageHero";
import BookingFlow from "@/components/booking/BookingFlow";
import Policy from "@/components/booking/Policy";
import { stripeSecretKey } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book a lash appointment",
  description:
    "Choose your lash set, pick a day and time and hold it with a £15 deposit. Lash extensions near Dartford Station, Kent.",
};

export const dynamic = "force-dynamic";

export default function BookingPage({ searchParams }: { searchParams: { t?: string } }) {
  const cardEnabled = Boolean(stripeSecretKey);
  return (
    <>
      <Header current="/booking" />
      <main id="top">
        <PageHero
          title="Book a lash appointment online"
          lead="Choose a set, pick a time and hold it with a £15 deposit."
          photo={{ src: "/images/lash-tray-tweezers.jpg", alt: "Lash tweezers resting on a tray of extensions", pos: "50% 55%" }}
          action={{ href: "#book", label: "Choose a treatment" }}
        />
        <section className="section scroll-mt-20" id="book" aria-label="Booking">
          <div className="container">
            <BookingFlow initialTreatment={searchParams.t} cardEnabled={cardEnabled} />
          </div>
        </section>
        <Policy />
      </main>
      <SiteFooter close={{ title: "Questions before you book?", line: "Send Zee a message and she will help you choose a set." }} />
    </>
  );
}
