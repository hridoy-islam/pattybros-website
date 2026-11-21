import { deposit } from "@/lib/site";

const items = [
  {
    title: "Deposits",
    text: `Every set and infill needs a £${deposit.amount} deposit to hold your time. It comes off the price on the day.`,
  },
  {
    title: "Cancelling",
    text: `Cancel at least ${deposit.policyHours} hours before your appointment and your deposit is refunded or moved to a new date. Later than that, the deposit is kept.`,
  },
  {
    title: "Rescheduling",
    text: `You can move your appointment once, free, with ${deposit.policyHours} hours’ notice. Reply to your confirmation email with the new day you would like.`,
  },
  {
    title: "Arriving late",
    text: "More than 15 minutes late and your set may need to be shortened or rebooked, so the next client is not kept waiting.",
  },
  { title: "Patch test", text: "New clients need a free patch test at least 48 hours before their first set." },
  { title: "Infills", text: "Infills are for LashesByZee sets with at least 40% still on. Otherwise, please book a full set." },
];

// The booking, cancellation and rescheduling policy, every answer open
export default function Policy() {
  return (
    <section className="section scroll-mt-20" id="policy" aria-labelledby="policy-h">
      <div className="container">
        <h2 id="policy-h" className="h2">
          Booking and cancellation policy
        </h2>
        <p className="lead mt-4">Please read this before you book. It keeps appointments fair for every client.</p>
        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {items.map((i) => (
            <div key={i.title}>
              <h3 className="text-2xl">{i.title}</h3>
              <p className="mt-2">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
