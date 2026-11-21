import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/public/Header";
import SiteFooter from "@/components/public/SiteFooter";
import { sendMail, studioEmail } from "@/lib/mailer";

export const metadata: Metadata = {
  title: "Booking confirmed",
  description: "Your LashesByZee deposit is paid and your appointment is held.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// Stripe sends the client back here after the card deposit. We check the payment with Stripe before saying so.
async function checkPayment(sessionId?: string) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return null;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { payment_status: string; amount_total: number; metadata?: { ref?: string } };
}

export default async function ConfirmedPage({ searchParams }: { searchParams: { ref?: string; session_id?: string } }) {
  const session = await checkPayment(searchParams.session_id);
  const paid = session?.payment_status === "paid";
  const ref = session?.metadata?.ref || searchParams.ref || "";
  if (paid) {
    await sendMail({
      to: studioEmail(),
      subject: `Deposit paid for ${ref}`,
      text: `The card deposit of £${(session!.amount_total / 100).toFixed(2)} for booking ${ref} is paid.`,
    }).catch(() => undefined);
  }
  return (
    <>
      <Header />
      <main id="top" className="pt-16 md:pt-[72px]">
        <section className="section" aria-labelledby="ok-h">
          <div className="container grid max-w-[640px] gap-5 md:max-w-none">
            <h1 id="ok-h" className="text-4xl md:text-5xl">
              {paid ? "Your deposit is paid" : "We could not confirm the payment yet"}
            </h1>
            <p className="lead max-w-prose">
              {paid
                ? `Your appointment is held. Your reference is ${ref}, and the details are in your inbox.`
                : "If you paid, your confirmation email will arrive shortly. If not, you can try again from the booking page."}
            </p>
            <Link className="link-arrow self-start" href={paid ? "/services" : "/booking"}>
              {paid ? "See aftercare and infills" : "Go back to booking"}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter close={{ title: "See you in the studio", line: "Near Dartford Station, Dartford, Kent." }} />
    </>
  );
}
