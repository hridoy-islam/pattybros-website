// Mock database for the admin. Seeded once, then kept in the browser's localStorage so edits survive a
// reload. Replace with the real API by setting USE_MOCK to false and API_URL in lib/axios.ts.
import { treatments as seedTreatments } from "@/lib/services";
import { hours as seedHours, deposit as seedDeposit, site } from "@/lib/site";
import type { Booking, BookingStatus, MockDb, ServiceItem, StudioSettings, User } from "@/types";
import { DATE_FMT, now } from "@/lib/moment-setup";

const KEY = "lashesbyzee-mock-db";

const users: User[] = [
  {
    _id: "u_admin",
    name: "Zee",
    email: "admin@gmail.com",
    role: "admin",
    password: "123456",
    image: "/logo-256.png",
  },
];

const firstNames = ["Amelia", "Grace", "Sophie", "Jade", "Chloe", "Leah", "Aisha", "Ruby", "Mia", "Zara", "Hannah", "Priya", "Ella", "Nadia", "Holly"];
const lastNames = ["Turner", "Okoro", "Bennett", "Hughes", "Patel", "Clarke", "Ahmed", "Reid", "Walsh", "Khan", "Morris", "Evans"];
const times = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:00"];

function seedBookings(services: ServiceItem[]): Booking[] {
  const out: Booking[] = [];
  const today = now().startOf("day");
  for (let i = 0; i < 36; i++) {
    const s = services[(i * 7) % services.length];
    const d = today.clone().add(i - 14, "days");
    if (d.day() === 1) d.add(1, "day"); // closed Mondays
    const past = d.isBefore(today);
    const status: BookingStatus = past ? (i % 9 === 0 ? "cancelled" : "completed") : i % 4 === 0 ? "pending" : "confirmed";
    const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 5) % lastNames.length]}`;
    const deposit = s.price > 0 ? Math.min(seedDeposit.amount, s.price) : 0;
    out.push({
      _id: `b_${(1000 + i).toString(36)}`,
      ref: `LBZ-${(48213 + i * 37).toString(36).toUpperCase()}`,
      customerName: name,
      customerEmail: `${name.split(" ")[0].toLowerCase()}@example.com`,
      customerPhone: `07700 900${String(100 + i).slice(-3)}`,
      serviceId: s._id,
      serviceName: s.name,
      price: s.price,
      minutes: s.minutes,
      date: d.format(DATE_FMT),
      time: times[i % times.length],
      status,
      depositAmount: deposit,
      depositMethod: i % 3 === 0 ? "transfer" : "card",
      depositPaid: deposit > 0 && (status === "completed" || status === "confirmed" || i % 5 === 0),
      newClient: i % 6 === 0,
      notes: i % 8 === 0 ? "Sensitive eyes, prefers a lighter curl." : "",
      createdAt: d.clone().subtract(5, "days").hour(9).toISOString(),
    });
  }
  return out;
}

function seed(): MockDb {
  const services: ServiceItem[] = seedTreatments.map((t, i) => ({
    _id: `s_${t.id}`,
    slug: t.id,
    name: t.name,
    group: t.group,
    minutes: t.minutes,
    price: t.price,
    short: t.short,
    description: t.description,
    suitableFor: t.suitableFor,
    image: t.image?.src || "",
    popular: Boolean(t.popular),
    active: true,
    order: i,
  }));
  const settings: StudioSettings = {
    studioName: site.longName,
    tagline: site.tagline,
    email: site.email,
    phone: "",
    instagram: site.instagramHandle,
    area: site.area,
    areaLine: site.areaLine,
    depositAmount: seedDeposit.amount,
    cancellationHours: seedDeposit.policyHours,
    hours: seedHours.map((h) => ({ label: h.label, time: h.time })),
  };
  return { users, services, bookings: seedBookings(services), settings };
}

export function loadDb(): MockDb {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    /* fall through to a fresh seed */
  }
  const db = seed();
  saveDb(db);
  return db;
}

export function saveDb(db: MockDb) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked: the change lives for this page only */
  }
}

export function resetDb() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
