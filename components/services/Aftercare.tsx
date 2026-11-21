import Link from "next/link";
import { treatments, formatDuration, formatPrice } from "@/lib/services";

const bookLabel = (id: string) => (id === "patch-test" ? "Book a patch test" : id === "removal" ? "Book a removal" : "Book this infill");

// Infills, removal and the patch test as ruled rows beside one photograph
export default function Aftercare() {
  const rows = treatments.filter((t) => t.group !== "sets");
  return (
    <section className="section" id="infills" aria-labelledby="infills-h">
      <div className="container grid items-start gap-10 lg:grid-cols-2 lg:gap-6">
        <div>
          <h2 id="infills-h" className="h2">
            Infills, removal and patch test
          </h2>
          <p className="lead mt-4">Book an infill every two to three weeks to keep your set full.</p>
          <ul className="mt-8">
            {rows.map((t) => (
              <li key={t.id} id={t.id} className="scroll-mt-24 border-b border-ink/10 py-4">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-medium">{t.name}</span>
                  <span className="font-medium tabular-nums">{formatPrice(t.price)}</span>
                </div>
                <p className="mt-1">
                  {t.description} {formatDuration(t.minutes)}.
                </p>
                <Link href={`/booking?t=${t.id}`} className="link-arrow mt-2 text-[15px]">
                  {bookLabel(t.id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-[4/5] overflow-hidden lg:sticky lg:top-24">
          <img
            src="/images/tweezers-application.jpg"
            alt="A lash artist holding two pairs of tweezers over a client's closed eye"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
