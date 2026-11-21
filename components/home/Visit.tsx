import Hours from "@/components/public/Hours";
import { site } from "@/lib/site";

// Where the studio is: the area set large, then the visit panel beside a photograph
export default function Visit() {
  return (
    <section className="section" id="visit" aria-labelledby="visit-h">
      <div className="container">
        <h2 id="visit-h" className="h2">
          Find the studio
        </h2>
        <p className="mt-6 font-display text-[clamp(48px,7vw,104px)] leading-[1.02] tracking-[-0.03em]">
          <a href={site.mapUrl} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px]">
            {site.area}
          </a>
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="lg:bg-cream lg:p-12">
            <div className="grid gap-6 sm:grid-cols-[0.8fr_1.2fr]">
              <div>
                <address className="text-lg not-italic leading-relaxed md:text-xl">
                  {site.areaLine}
                  <br />
                  {site.area}
                </address>
                <a href={site.mapUrl} className="link-arrow mt-4">
                  See the area
                </a>
              </div>
              <Hours />
            </div>
            <ul className="mt-6">
              {[
                ["Appointments", "By booking only"],
                ["New clients", "Free patch test 48 hours before"],
              ].map(([k, v]) => (
                <li key={k} className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 border-t border-ink/10 py-2">
                  <span className="text-muted">{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="/images/lash-tray-tweezers.jpg"
              alt="Fine lash tweezers resting on a tray of lash extensions"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
