import Link from "next/link";
import { groups, treatments, formatPrice } from "@/lib/services";

// Prices in two lists, then the four most popular sets as photographs
export default function PopularSets() {
  const popular = treatments.filter((t) => t.popular);
  return (
    <section className="section" id="sets" aria-labelledby="sets-h">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="sets-h" className="h2">
            Lash sets and prices
          </h2>
          <Link href="/services" className="link-arrow">
            See every treatment
          </Link>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-6">
          {groups
            .filter((g) => g.id !== "other")
            .map((g) => (
              <div key={g.id}>
                <p className="text-[13px] font-medium">{g.label}</p>
                <ul className="mt-3">
                  {treatments
                    .filter((t) => t.group === g.id)
                    .slice(0, 4)
                    .map((t) => (
                      <li key={t.id} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-3.5">
                        <span className="font-medium">{t.name}</span>
                        <span className="tabular-nums">{formatPrice(t.price)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-6">
          {popular.map((t) => (
            <Link key={t.id} href={`/services#${t.id}`} className="group block" aria-label={t.name}>
              <div className="aspect-square overflow-hidden">
                <img src={t.image!.src} alt={t.image!.alt} loading="lazy" className="zoom-img" />
              </div>
              <p className="mt-3 font-display text-xl transition-colors group-hover:text-primary-dark">{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
