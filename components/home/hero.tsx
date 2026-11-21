import Link from "next/link";
import Arrow from "@/components/public/Arrow";
import { mainAction } from "@/lib/site";

const facts = [
  { label: "Lash styles", value: "Classic to mega volume" },
  { label: "New clients", value: "Free patch test" },
  { label: "Studio", value: "Near Dartford Station" },
];

// Home hero: the words on the left, an arch-framed portrait on the right with a turning brand seal.
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden pb-14 pt-[calc(64px+28px)] md:pb-20 md:pt-[calc(72px+56px)] lg:flex lg:min-h-[min(100svh,860px)] lg:items-center"
      aria-labelledby="hero-h"
    >
      {/* a soft cream panel behind the photograph */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[40%] bg-cream lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[36%]" />

      <div className="container relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-[clamp(32px,5.5vw,104px)]">
        <div className="grid max-w-[620px] gap-5">
          <p className="eyebrow animate-fade-up">Lashes by Zee London</p>
          <h1 id="hero-h" className="animate-fade-up text-[clamp(38px,11vw,48px)] leading-[1.02] tracking-[-0.025em] [animation-delay:80ms] [text-wrap:balance] md:text-[clamp(44px,5.6vw,84px)]">
            Luxury lash extensions <em className="block text-primary-dark">in Dartford, Kent</em>
          </h1>
          <p className="lead max-w-[46ch] animate-fade-up [animation-delay:160ms]">
            Bespoke eyelash extensions tailored exclusively to you, each set designed to complement your eye shape and
            personal style.
          </p>
          <div className="mt-2 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Link href={mainAction.href} className="btn-primary group h-[52px]">
              {mainAction.label}
              <Arrow />
            </Link>
            <Link href="/services" className="btn-secondary h-[52px]">
              View lash sets
            </Link>
          </div>
          <dl className="mt-4 grid animate-fade-up gap-3 border-t border-line pt-5 [animation-delay:320ms] sm:grid-cols-3 sm:gap-5">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[120px_1fr] items-baseline gap-1 sm:grid-cols-1">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-primary-dark">{f.label}</dt>
                <dd className="font-display text-[19px] leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-[calc(100%-18px)] max-w-[440px] lg:mr-0 lg:w-full lg:max-w-[520px]">
          {/* the arch photograph with a thin gold arch offset behind it */}
          <div className="relative aspect-[4/5] lg:max-h-[calc(100svh-212px)]">
            <div aria-hidden="true" className="absolute inset-0 translate-x-[18px] translate-y-[18px] rounded-t-full border border-primary" />
            <img
              src="/images/tweezers-application.jpg"
              alt="A lash artist placing extensions with two pairs of fine tweezers on a client's closed eye"
              fetchPriority="high"
              className="relative h-full w-full animate-fade-in rounded-t-full object-cover object-[50%_35%]"
            />
          </div>
          {/* the brand seal */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -left-2 grid h-28 w-28 place-items-center rounded-full bg-ivory shadow-[0_18px_40px_rgba(27,21,15,.12)] md:bottom-[12%] md:-left-6 md:h-[148px] md:w-[148px] lg:-left-16"
          >
            <svg className="absolute inset-0 h-full w-full animate-spin-slow motion-reduce:animate-none" viewBox="0 0 200 200">
              <defs>
                <path id="seal-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
              </defs>
              <text className="fill-primary-dark font-sans text-[13px] font-medium uppercase tracking-[0.22em]">
                <textPath href="#seal-circle">Luxury lash extensions · Dartford, Kent ·</textPath>
              </text>
            </svg>
            <img src="/logo-256.png" alt="" className="h-14 w-14 md:h-[76px] md:w-[76px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
