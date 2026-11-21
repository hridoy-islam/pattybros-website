import Link from "next/link";
import { mainAction } from "@/lib/site";

type Props = {
  title: string;
  lead: string;
  photo: { src: string; alt: string; pos?: string };
  action?: { href: string; label: string } | null;
};

// Inner-page hero: a wide photograph under the header, then the title on the left and the line and button on the right.
export default function PageHero({ title, lead, photo, action = mainAction }: Props) {
  return (
    <section className="pt-16 md:pt-[72px]" aria-labelledby="hero-h">
      <div className="h-[300px] overflow-hidden md:h-[min(480px,53svh)]">
        <img
          src={photo.src}
          alt={photo.alt}
          fetchPriority="high"
          className="h-full w-full animate-fade-in object-cover"
          style={{ objectPosition: photo.pos || "50% 50%" }}
        />
      </div>
      <div className="container grid gap-5 pt-8 md:grid-cols-2 md:gap-6 md:pt-10">
        <h1 className="animate-fade-up text-[34px] leading-[1.1] md:text-5xl">{title}</h1>
        <div className="animate-fade-up [animation-delay:120ms]">
          <p className="lead max-w-[40ch]">{lead}</p>
          {action ? (
            <Link href={action.href} className="btn-primary mt-5 w-full sm:w-auto">
              {action.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
