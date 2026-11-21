import Link from "next/link";
import Arrow from "./Arrow";
import Hours from "./Hours";
import SocialLinks from "./SocialLinks";
import { mainAction, site } from "@/lib/site";
import { now } from "@/lib/moment-setup";

type Close = { title: string; line: string };

const columns = [
  {
    title: "Lashes",
    links: [
      { href: "/services", label: "Services and prices" },
      { href: "/gallery", label: "Gallery" },
      { href: "/booking", label: "Book online" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About Zee" },
      { href: "/contact", label: "Contact" },
      { href: "/booking#policy", label: "Booking policy" },
    ],
  },
];

const footerLink =
  "inline-flex min-h-9 items-center text-base text-ivory transition-colors hover:text-primary";

// Espresso footer with gold accents: the booking call, then the directory and the legal row.
export default function SiteFooter({ close }: { close: Close }) {
  return (
    <footer className="mt-10 bg-black/95 pb-8 pt-16 text-ivory md:mt-16 md:pt-24" aria-labelledby="close-h">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-primary/35 pb-12 md:pb-20">
          <div>
            <h2 id="close-h" className="font-display text-4xl leading-[1.05] md:text-[56px] lg:text-[64px]">
              {close.title}
            </h2>
            <p className="lead mt-4 text-ivory">{close.line}</p>
          </div>
          <Link href={mainAction.href} className="btn-primary group w-full sm:w-auto">
            {mainAction.label}
            <Arrow />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-12 md:pt-16 lg:grid-cols-[4fr_2fr_2fr_4fr] lg:gap-6">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="LashesByZee, home">
              <img src="/logo-256.png" alt="" className="h-24 w-24" />
            </Link>
            <p className="mt-4 max-w-[26ch] font-display text-[22px] leading-snug">
              Luxury lash extensions near Dartford Station, {site.area}.
            </p>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="mb-4 font-sans text-[13px] font-medium text-primary">{c.title}</h3>
              <ul className="grid gap-1">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-4 font-sans text-[13px] font-medium text-primary">Opening hours</h3>
            <Hours className="text-base" />
            <a href={site.mapUrl} className={`${footerLink} mt-4 underline decoration-ivory/30 underline-offset-4`}>
              {site.areaLine}, {site.area}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ivory/15 pt-6 text-sm text-espresso-muted sm:flex-row sm:items-center sm:gap-8 md:mt-16">
          <span>
            &copy; {now().year()} {site.name}
          </span>
          <Link href="/privacy" className="text-ivory transition-colors hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="text-ivory transition-colors hover:text-primary">
            Terms
          </Link>
          <SocialLinks className="-ml-2.5 sm:ml-auto sm:mr-[-10px]" />
        </div>
      </div>
    </footer>
  );
}
