import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/public/TextPage";
import { deposit } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", description: "The terms for booking lash treatments with LashesByZee." };

export default function TermsPage() {
  return (
    <TextPage title="Terms">
      <p>
        These terms apply to every appointment booked with LashesByZee, online or in person. The{" "}
        <Link className="underline underline-offset-4 transition-colors hover:text-primary" href="/booking#policy">
          booking and cancellation policy
        </Link>{" "}
        is part of them.
      </p>
      <h2>Deposits and payment</h2>
      <p>
        A £{deposit.amount} deposit holds your appointment and is taken off the price on the day. The rest is paid in the
        studio.
      </p>
      <h2>Your health and safety</h2>
      <p>
        Please tell Zee about eye conditions, allergies, recent eye surgery or pregnancy before your appointment. New clients
        need a patch test at least 48 hours before their first set. Zee may decline or stop a treatment if it is not safe to
        continue.
      </p>
      <h2>Aftercare</h2>
      <p>
        Results depend on following the aftercare advice: keep lashes dry for 24 hours, avoid oil-based products and do not
        pull or rub them. Retention problems from not following aftercare are not covered by a free fix.
      </p>
      <h2>Fixes</h2>
      <p>If something is not right with your set, get in touch within 72 hours and Zee will fix it at no cost.</p>
    </TextPage>
  );
}
