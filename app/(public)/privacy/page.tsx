import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/public/TextPage";

export const metadata: Metadata = { title: "Privacy", description: "How LashesByZee uses the details you share when you book or get in touch." };

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy">
      <p>
        When you book or send a message, LashesByZee receives your name, email, mobile number and anything you write in the
        form. We use these only to arrange and confirm your appointment and to answer you.
      </p>
      <h2>What we keep</h2>
      <p>
        Booking details are kept for as long as you are a client, plus the time the law asks us to keep payment records. We
        never sell or share your details for marketing.
      </p>
      <h2>Payments</h2>
      <p>Card deposits are taken by Stripe. Your card details go straight to Stripe and are never seen or stored by us.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete the details we hold about you at any time through the{" "}
        <Link className="link-arrow" href="/contact">
          contact form
        </Link>
      </p>
    </TextPage>
  );
}
