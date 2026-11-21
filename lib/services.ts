// Treatments. Prices and durations are assumed (the client has not given them yet) and are marked
// data-assumed wherever they appear on the page.

export type Treatment = {
  id: string;
  name: string;
  group: "sets" | "infills" | "other";
  minutes: number;
  price: number; // £
  short: string;
  description: string;
  suitableFor: string;
  image?: { src: string; alt: string };
  popular?: boolean;
};

export const treatments: Treatment[] = [
  {
    id: "classic",
    name: "Classic full set",
    group: "sets",
    minutes: 120,
    price: 45,
    short: "One extension on each natural lash",
    description:
      "One extension placed on each natural lash, so the set looks like your own lashes on a good day: longer, darker and evenly curled.",
    suitableFor: "First-timers and anyone who wants a natural look and has healthy, full natural lashes.",
    image: { src: "/images/set-classic.jpg", alt: "A blue eye with long, separated classic lash extensions" },
    popular: true,
  },
  {
    id: "hybrid",
    name: "Hybrid full set",
    group: "sets",
    minutes: 135,
    price: 55,
    short: "Classic lashes mixed with light volume fans",
    description:
      "A mix of single classic lashes and light handmade fans. Fuller than a classic set, softer than full volume, with a little texture.",
    suitableFor: "Anyone who finds classic too subtle, or has a few gaps in their natural lash line to fill.",
    image: { src: "/images/set-hybrid.jpg", alt: "Close-up of a hazel eye with soft, textured hybrid lashes" },
    popular: true,
  },
  {
    id: "russian-volume",
    name: "Russian volume full set",
    group: "sets",
    minutes: 150,
    price: 62,
    short: "Handmade fans of 3 to 6 fine lashes",
    description:
      "Fans of three to six very fine lashes made by hand and placed on each natural lash, for a dark, full and fluffy line.",
    suitableFor: "Sparse or thin natural lashes, and anyone who wants a full lash line without lining their eyes.",
    image: { src: "/images/set-russian-volume.jpg", alt: "A brown eye with full, dark Russian volume lashes" },
    popular: true,
  },
  {
    id: "wispy",
    name: "Wispy full set",
    group: "sets",
    minutes: 150,
    price: 68,
    short: "Spikes of longer lashes over a soft base",
    description:
      "Longer spikes set between softer fans, for a fluttery, textured line that looks good up close and in photos.",
    suitableFor: "Anyone who wants texture and movement rather than an even line.",
    image: { src: "/images/set-wispy.jpg", alt: "A green eye with long, wispy lashes in warm light" },
    popular: true,
  },
  {
    id: "anime",
    name: "Anime full set",
    group: "sets",
    minutes: 150,
    price: 68,
    short: "Bold, defined spikes on top and bottom",
    description:
      "Clearly defined spikes with space between them, inspired by anime characters. Bottom lash spikes can be added at no extra cost.",
    suitableFor: "Anyone who wants a bold statement set for an event, photos or every day.",
    image: { src: "/images/set-anime.jpg", alt: "Eyes looking down, wearing long, glittering statement lashes" },
  },
  {
    id: "mega-volume",
    name: "Mega volume full set",
    group: "sets",
    minutes: 180,
    price: 78,
    short: "Dense fans of 7 to 16 ultra-fine lashes",
    description:
      "Dense fans of seven to sixteen ultra-fine lashes for the darkest, fullest look we offer, still light on the natural lash.",
    suitableFor: "Experienced lash wearers with strong natural lashes who want maximum density.",
    image: { src: "/images/set-mega-volume.jpg", alt: "Side view of an eye with very full, dark mega volume lashes" },
  },
  {
    id: "infill-classic",
    name: "Classic infill",
    group: "infills",
    minutes: 60,
    price: 30,
    short: "Within 2 to 3 weeks of your full set",
    description: "Replaces the lashes that have shed so your set stays full.",
    suitableFor: "Classic sets done at LashesByZee, with at least 40% of the set still on.",
  },
  {
    id: "infill-hybrid",
    name: "Hybrid infill",
    group: "infills",
    minutes: 75,
    price: 35,
    short: "Within 2 to 3 weeks of your full set",
    description: "Replaces the lashes that have shed so your set stays full.",
    suitableFor: "Hybrid sets done at LashesByZee, with at least 40% of the set still on.",
  },
  {
    id: "infill-volume",
    name: "Volume, wispy or anime infill",
    group: "infills",
    minutes: 90,
    price: 40,
    short: "Within 2 to 3 weeks of your full set",
    description: "Replaces the fans that have shed so your set stays full.",
    suitableFor: "Russian volume, wispy and anime sets done at LashesByZee.",
  },
  {
    id: "infill-mega",
    name: "Mega volume infill",
    group: "infills",
    minutes: 105,
    price: 48,
    short: "Within 2 to 3 weeks of your full set",
    description: "Replaces the fans that have shed so your set stays full.",
    suitableFor: "Mega volume sets done at LashesByZee.",
  },
  {
    id: "removal",
    name: "Lash removal",
    group: "other",
    minutes: 30,
    price: 15,
    short: "Gentle removal with a cream remover",
    description: "Safe removal of extensions, ours or another studio's, without pulling on your natural lashes.",
    suitableFor: "Anyone taking a break, or coming to us with a set from somewhere else.",
  },
  {
    id: "patch-test",
    name: "Patch test",
    group: "other",
    minutes: 15,
    price: 0,
    short: "At least 48 hours before your first set",
    description: "A few lashes are applied to check your skin and eyes are happy with the adhesive.",
    suitableFor: "Every new client, and anyone who has had a reaction to lash adhesive before.",
  },
];

export const groups: { id: Treatment["group"]; label: string }[] = [
  { id: "sets", label: "Full sets" },
  { id: "infills", label: "Infills" },
  { id: "other", label: "Removal and patch test" },
];

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr${h > 1 ? "s" : ""}`;
}

export function formatPrice(price: number) {
  return price === 0 ? "Free" : `£${price}`;
}

export function findTreatment(id: string | null | undefined) {
  return treatments.find((t) => t.id === id);
}
