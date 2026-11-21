// One place for the studio's facts. Anything the client has not confirmed yet is marked `assumed`
// so it can be checked and replaced before launch.

export const site = {
  name: "LashesByZee",
  longName: "Lashes by Zee London",
  tagline: "Luxury lash extensions",
  url: process.env.SITE_URL || "http://localhost:3000",
  area: "Dartford, Kent",
  areaLine: "Near Dartford Station",
  // "See the area" opens a map search for the district only: no street or postcode until Zee supplies one
  mapUrl: "https://www.openstreetmap.org/search?query=Dartford%20Station%20Dartford",
  // Empty until Zee gives her Instagram account; the links show once this is filled in
  instagramUrl: "",
  instagramHandle: "",
  // Mailto stand-in for buttons; the forms post to /api/* and email STUDIO_EMAIL
  email: "hello@lashesbyzee.example",
  timezone: "Europe/London",
};

/** Opening hours. Assumed until Zee confirms them (marked data-assumed on the page). */
export const hours: { label: string; days: string; time: string; open?: string; close?: string }[] = [
  { label: "Monday", days: "mon", time: "Closed" },
  { label: "Tuesday to Friday", days: "tue-fri", time: "10:00 to 19:00", open: "10:00", close: "19:00" },
  { label: "Saturday", days: "sat", time: "9:00 to 17:00", open: "09:00", close: "17:00" },
  { label: "Sunday", days: "sun", time: "10:00 to 15:00", open: "10:00", close: "15:00" },
];

export const deposit = {
  amount: 15, // £, assumed
  policyHours: 48,
};

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const mainAction = { href: "/booking", label: "Book an appointment" };
