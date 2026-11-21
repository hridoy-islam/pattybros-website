import { NextResponse } from "next/server";
import { z } from "zod";
import { findTreatment, formatDuration, formatPrice } from "@/lib/services";
import { isBookable } from "@/lib/availability";
import { day, now } from "@/lib/moment-setup";
import { deposit, site } from "@/lib/site";
import { sendMail, studioEmail } from "@/lib/mailer";

const schema = z.object({
  treatment: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(7).max(20),
  notes: z.string().trim().max(600).optional().default(""),
  newClient: z.boolean().default(false),
  depositMethod: z.enum(["card", "transfer"]),
  policy: z.literal(true),
});

const longDate = (iso: string) =>
  day(iso).format("dddd D MMMM YYYY");

export async function POST(req: Request) {
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Some details are missing. Check the form and try again." }, { status: 400 });
  }

  const t = findTreatment(data.treatment);
  if (!t) return NextResponse.json({ error: "Choose a treatment." }, { status: 400 });
  if (!isBookable(data.date, data.time, t.minutes)) {
    return NextResponse.json({ error: "That time is no longer available. Choose another time." }, { status: 409 });
  }

  const ref = `LBZ-${now().valueOf().toString(36).toUpperCase().slice(-6)}`;
  const depositDue = t.price > 0 ? Math.min(deposit.amount, t.price) : 0;
  const when = `${longDate(data.date)} at ${data.time}`;
  const summary = [
    `Reference: ${ref}`,
    `Treatment: ${t.name} (${formatDuration(t.minutes)}, ${formatPrice(t.price)})`,
    `When: ${when}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `New client: ${data.newClient ? "yes, needs a patch test" : "no"}`,
    `Deposit: ${depositDue ? `£${depositDue} by ${data.depositMethod === "card" ? "card" : "bank transfer"}` : "none"}`,
    data.notes ? `Notes: ${data.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Card deposit through Stripe Checkout, when a key is set
  let checkoutUrl: string | null = null;
  if (depositDue && data.depositMethod === "card") {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Card payments are not switched on yet. Choose bank transfer for the deposit." },
        { status: 409 }
      );
    }
    const body = new URLSearchParams({
      mode: "payment",
      customer_email: data.email,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "gbp",
      "line_items[0][price_data][unit_amount]": String(depositDue * 100),
      "line_items[0][price_data][product_data][name]": `Deposit: ${t.name}, ${when}`,
      "metadata[ref]": ref,
      success_url: `${site.url}/booking/confirmed?ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/booking?t=${t.id}`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = await res.json();
    if (!res.ok || !json.url) {
      return NextResponse.json({ error: "The card payment could not start. Try again or choose bank transfer." }, { status: 502 });
    }
    checkoutUrl = json.url;
  }

  try {
    await sendMail({
      to: studioEmail(),
      subject: `New booking request ${ref}: ${t.name}, ${when}`,
      text: `${summary}\n\n${checkoutUrl ? "The client is being sent to pay the deposit by card." : ""}`,
      replyTo: data.email,
    });
    await sendMail({
      to: data.email,
      subject: `Your LashesByZee booking request ${ref}`,
      text:
        `Hi ${data.name.split(" ")[0]},\n\nThank you for booking with LashesByZee. Here is what you asked for:\n\n${summary}\n\n` +
        (depositDue && data.depositMethod === "transfer"
          ? `Please pay the £${depositDue} deposit by bank transfer within 24 hours, using ${ref} as the reference. Zee will send the bank details when she confirms your time.\n\n`
          : "") +
        `Zee will confirm your appointment by email. Cancellations and changes need ${deposit.policyHours} hours' notice to keep your deposit.\n\nLashesByZee, ${site.areaLine}, ${site.area}`,
    });
  } catch {
    return NextResponse.json({ error: "Your request could not be sent. Try again in a few minutes." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ref, checkoutUrl, depositDue });
}
