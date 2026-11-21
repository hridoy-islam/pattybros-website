import type { BookingStatus } from "@/types";
import moment, { day, TZ } from "@/lib/moment-setup";
import { Button } from "@/components/ui/button";

/** Radix Select items cannot have an empty value, so "any" stands for "no filter" in the admin selects. */
export const ANY = "any";

export const STATUS_OPTIONS: { value: typeof ANY | BookingStatus; label: string }[] = [
  { value: ANY, label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/** Appointment times every half hour, 07:00 to 21:00. A time already saved off the half hour is added in. */
export const timeOptions = (current?: string) => {
  const out: string[] = [];
  for (let m = 7 * 60; m <= 21 * 60; m += 30) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  if (current && !out.includes(current)) out.push(current), out.sort();
  return out;
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge--${status}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}

export function DepositBadge({ amount, paid }: { amount: number; paid: boolean }) {
  if (!amount) return <span className="badge badge--off">No deposit</span>;
  return <span className={`badge ${paid ? "badge--paid" : "badge--due"}`}>{paid ? `£${amount} paid` : `£${amount} due`}</span>;
}

export function Loading() {
  return (
    <div className="loading" role="status" aria-label="Loading">
      <div className="dots">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="pager">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="pager__btns">
        <Button variant="outline" size="sm" type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

/** "Wed, 2 Dec 2026" for a London day */
export const fmtDate = (iso: string) => day(iso).format("ddd, D MMM YYYY");

/** "2 Dec 2026, 14:05" in London time, for a timestamp */
export const fmtDateTime = (ts: string) => moment(ts).tz(TZ).format("D MMM YYYY, HH:mm");

export const fmtMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? (r ? `${h} hr ${r} min` : `${h} hr`) : `${r} min`;
};
