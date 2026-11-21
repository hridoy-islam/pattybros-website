import Link from "next/link";
import { treatments, formatDuration, formatPrice } from "@/lib/services";

// The six full sets: picture, name, what it is, who it suits, time and price, and a link into the booking
export default function SetTiles() {
  const sets = treatments.filter((t) => t.group === "sets");
  return (
    <section className="section" id="sets" aria-labelledby="sets-h">
      <div className="container">
        <h2 id="sets-h" className="h2">
          Full lash sets
        </h2>
        <p className="lead mt-4 max-w-prose">
          Not sure which set suits you? Zee will look at your natural lashes and eye shape before she starts.
        </p>
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((t) => (
            <article key={t.id} id={t.id} className="scroll-mt-24">
              <Link href={`/booking?t=${t.id}`} className="group grid gap-4">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={t.image!.src} alt={t.image!.alt} loading="lazy" className="zoom-img" />
                </div>
                <h3 className="text-[28px] leading-tight transition-colors group-hover:text-primary-dark">{t.name}</h3>
                <p>{t.description}</p>
                <p>
                  <b className="font-medium">Suits:</b> {t.suitableFor}
                </p>
                <p className="flex gap-6 font-medium tabular-nums">
                  <span>{formatDuration(t.minutes)}</span>
                  <span>{formatPrice(t.price)}</span>
                </p>
                <span className="link-arrow self-start">Book this set</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
