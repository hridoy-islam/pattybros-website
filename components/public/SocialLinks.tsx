import { siFacebook, siInstagram, siTiktok, type SimpleIcon } from "simple-icons";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// The studio's social profiles as their real brand icons (simple-icons). URLs live in lib/site.ts (site.socials).
const items: { icon: SimpleIcon; url: string }[] = [
  { icon: siInstagram, url: site.instagramUrl || site.socials.instagram },
  { icon: siTiktok, url: site.socials.tiktok },
  { icon: siFacebook, url: site.socials.facebook },
];

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)} aria-label="Social media">
      {items.map(({ icon, url }) => (
        <li key={icon.slug}>
          <a
            href={url || "#"}
            target={url ? "_blank" : undefined}
            rel={url ? "noreferrer" : undefined}
            aria-label={`${site.name} on ${icon.title}`}
            className="grid h-10 w-10 place-items-center rounded-full text-ivory transition-colors hover:bg-ivory/10 hover:text-primary"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d={icon.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
