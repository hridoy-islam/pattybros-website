// Appointment times offered online, worked out from the studio's hours, all in London time (moment-timezone).
// Times already taken are not known to the website yet: every booking is a request Zee confirms.
import moment, { at, day, DATE_FMT, now as londonNow } from "@/lib/moment-setup";
import type { Moment } from "moment-timezone";

// 0 = Sunday ... 6 = Saturday
const WEEK: Record<number, { open: string; close: string } | null> = {
  0: { open: "10:00", close: "15:00" },
  1: null, // Monday closed
  2: { open: "10:00", close: "19:00" },
  3: { open: "10:00", close: "19:00" },
  4: { open: "10:00", close: "19:00" },
  5: { open: "10:00", close: "19:00" },
  6: { open: "09:00", close: "17:00" },
};

export const BOOKING_WINDOW_DAYS = 42;
export const MIN_NOTICE_HOURS = 24;
const STEP_MINUTES = 30;

/** "YYYY-MM-DD" for a London day */
export const isoDate = (d: Moment) => d.format(DATE_FMT);

export const isOpenDay = (iso: string) => WEEK[day(iso).day()] !== null;

/** Start times ("HH:mm") on a London day for a treatment of `minutes`, at least MIN_NOTICE_HOURS from now. */
export function slotsFor(iso: string, minutes: number, now: Moment = londonNow()): string[] {
  const d = day(iso);
  if (!d.isValid()) return [];
  const hours = WEEK[d.day()];
  if (!hours) return [];
  const earliest = now.clone().add(MIN_NOTICE_HOURS, "hours");
  const close = at(iso, hours.close);
  const out: string[] = [];
  for (let t = at(iso, hours.open); !t.clone().add(minutes, "minutes").isAfter(close); t.add(STEP_MINUTES, "minutes")) {
    if (!t.isBefore(earliest)) out.push(t.format("HH:mm"));
  }
  return out;
}

/** The last London day that can be booked */
export const lastBookableIso = (now: Moment = londonNow()) =>
  now.clone().startOf("day").add(BOOKING_WINDOW_DAYS, "days").format(DATE_FMT);

export function isBookable(iso: string, time: string, minutes: number, now: Moment = londonNow()) {
  if (!day(iso).isValid() || iso > lastBookableIso(now)) return false;
  return slotsFor(iso, minutes, now).includes(time);
}

/** "Wednesday 2 December" */
export const longDate = (iso: string) => day(iso).format("dddd D MMMM");

/** The London days of a month as "YYYY-MM-DD", with nulls before the 1st so weeks start on Monday */
export function monthGrid(monthIso: string): (string | null)[] {
  const first = day(monthIso).startOf("month");
  const lead = (first.day() + 6) % 7;
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let i = 0; i < first.daysInMonth(); i++) cells.push(first.clone().add(i, "days").format(DATE_FMT));
  return cells;
}

export { moment };
