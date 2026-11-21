"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { groups, treatments, findTreatment, formatDuration, formatPrice, type Treatment } from "@/lib/services";
import { isOpenDay, lastBookableIso, longDate, monthGrid, slotsFor } from "@/lib/availability";
import { day, DATE_FMT, now as londonNow } from "@/lib/moment-setup";
import { deposit } from "@/lib/site";

type Step = 1 | 2 | 3 | 4;
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// shared styles for this component
const stepTitle = "font-display text-[28px] leading-tight outline-none";
const stepNo = "mr-3 tabular-nums text-primary-dark";
const choiceRow =
  "grid min-h-11 cursor-pointer grid-cols-[24px_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line py-4 [&:has(input:checked)_.choice-name]:underline [&:has(input:checked)_.choice-name]:decoration-primary [&:has(input:checked)_.choice-name]:decoration-2 [&:has(input:checked)_.choice-name]:underline-offset-[6px]";
const radio = "h-[18px] w-[18px] self-center accent-primary-dark";
const toggleBtn =
  "border border-ink/25 bg-transparent text-base tabular-nums transition-colors hover:border-ink aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:font-medium aria-pressed:text-primary-foreground";

export default function BookingFlow({ initialTreatment, cardEnabled }: { initialTreatment?: string; cardEnabled: boolean }) {
  const [step, setStep] = useState<Step>(1);
  const [treatmentId, setTreatmentId] = useState<string>(findTreatment(initialTreatment)?.id ?? "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  // the month on show, as the London date of its 1st ("YYYY-MM-01")
  const [month, setMonth] = useState(() => londonNow().startOf("month").format(DATE_FMT));
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "", newClient: false });
  const [depositMethod, setDepositMethod] = useState<"card" | "transfer">(cardEnabled ? "card" : "transfer");
  const [policy, setPolicy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ ref: string; depositDue: number } | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const shownStep = useRef<Step>(1);

  const t: Treatment | undefined = findTreatment(treatmentId);
  const depositDue = t && t.price > 0 ? Math.min(deposit.amount, t.price) : 0;

  // move focus to the new step's heading, so keyboard and screen reader users land on it
  useEffect(() => {
    if (shownStep.current === step) return; // only when the step changes, never on the first load
    shownStep.current = step;
    headRef.current?.focus();
  }, [step]);

  const thisMonth = londonNow().startOf("month").format(DATE_FMT);
  const last = lastBookableIso();
  const days = useMemo(() => monthGrid(month), [month]);
  const shiftMonth = (n: number) => setMonth(day(month).add(n, "months").format(DATE_FMT));

  const slots = t && date ? slotsFor(date, t.minutes) : [];
  const dayHasSlots = (iso: string) => !!t && iso <= last && isOpenDay(iso) && slotsFor(iso, t.minutes).length > 0;
  const prevDisabled = month <= thisMonth;
  const nextDisabled = day(month).add(1, "months").format(DATE_FMT) > last;

  function goTo(next: Step) {
    setErrors({});
    setStatus("");
    setStep(next);
  }

  function nextFromTreatment() {
    if (!t) {
      setErrors({ treatment: "Choose the treatment you would like." });
      setStatus("1 field to fix.");
      return;
    }
    if (date && !slotsFor(date, t.minutes).includes(time)) setTime("");
    goTo(2);
  }

  function nextFromDate() {
    const e: Record<string, string> = {};
    if (!date) e.date = "Choose a day in the calendar.";
    else if (!time) e.time = "Choose a start time.";
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus("1 field to fix.");
      return;
    }
    goTo(3);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (details.name.trim().length < 2) e.name = "Write the name the booking is under.";
    if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) e.email = "Write an email address with an @, like name@example.com.";
    if (details.phone.replace(/\D/g, "").length < 7) e.phone = "Write a mobile number so Zee can reach you on the day.";
    if (!policy) e.policy = "Tick to agree to the booking policy.";
    setErrors(e);
    const n = Object.keys(e).length;
    if (n) {
      setStatus(n === 1 ? "1 field to fix." : `${n} fields to fix.`);
      document.getElementById(`b-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    const wait = setTimeout(() => setStatus("Sending"), 300);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatment: treatmentId, date, time, ...details, depositMethod, policy }),
      });
      const json = await res.json().catch(() => ({}));
      clearTimeout(wait);
      if (!res.ok) {
        setStatus(json.error || "Not sent: the connection failed. Your details are still here; try again.");
        return;
      }
      if (json.checkoutUrl) {
        setStatus("Taking you to the secure card payment");
        window.location.href = json.checkoutUrl;
        return;
      }
      setDone({ ref: json.ref, depositDue: json.depositDue });
      goTo(4);
    } catch {
      clearTimeout(wait);
      setStatus("Not sent: the connection failed. Your details are still here; try again.");
    } finally {
      setBusy(false);
    }
  }

  const fieldError = (k: string) =>
    errors[k] ? (
      <p className="field-error" id={`b-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;

  const inputCls = (k: string) => `field-input ${errors[k] ? "border-2 border-red-800" : ""}`;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
      <div className="grid gap-8">
        {step === 1 && (
          <div className="grid gap-5">
            <h2 tabIndex={-1} ref={headRef} className={stepTitle}>
              <span className={stepNo}>1 of 3</span>Choose your treatment
            </h2>
            {groups.map((g) => (
              <fieldset key={g.id} aria-describedby={errors.treatment ? "b-treatment-err" : undefined}>
                <legend className="mb-1 mt-4 text-[13px] font-medium">{g.label}</legend>
                {treatments
                  .filter((x) => x.group === g.id)
                  .map((x) => (
                    <label key={x.id} className={choiceRow}>
                      <input
                        type="radio"
                        name="treatment"
                        id={x.id === treatments[0].id ? "b-treatment" : undefined}
                        value={x.id}
                        checked={treatmentId === x.id}
                        onChange={() => setTreatmentId(x.id)}
                        className={radio}
                      />
                      <span className="choice-name font-medium">{x.name}</span>
                      <span className="font-medium tabular-nums">{formatPrice(x.price)}</span>
                      <span className="col-start-2 text-muted">
                        {formatDuration(x.minutes)} · {x.short}
                      </span>
                    </label>
                  ))}
              </fieldset>
            ))}
            {fieldError("treatment")}
            <div>
              <button className="btn-primary w-full sm:w-auto" type="button" onClick={nextFromTreatment}>
                Choose a date
              </button>
            </div>
          </div>
        )}

        {step === 2 && t && (
          <div className="grid gap-5">
            <h2 tabIndex={-1} ref={headRef} className={stepTitle}>
              <span className={stepNo}>2 of 3</span>Pick a day and time
            </h2>
            <div className="border border-line bg-ivory p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p aria-live="polite" className="font-display text-2xl">
                  {day(month).format("MMMM YYYY")}
                </p>
                <div className="flex gap-2">
                  <button
                    className="h-11 w-11 border border-ink/25 transition-colors hover:border-primary hover:bg-primary disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:bg-transparent"
                    type="button"
                    aria-label="Previous month"
                    disabled={prevDisabled}
                    onClick={() => shiftMonth(-1)}
                  >
                    &larr;
                  </button>
                  <button
                    className="h-11 w-11 border border-ink/25 transition-colors hover:border-primary hover:bg-primary disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:bg-transparent"
                    type="button"
                    aria-label="Next month"
                    disabled={nextDisabled}
                    onClick={() => shiftMonth(1)}
                  >
                    &rarr;
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center" role="group" aria-label="Available days">
                {DOW.map((d) => (
                  <span key={d} aria-hidden="true" className="py-2 text-[13px] font-medium text-muted">
                    {d}
                  </span>
                ))}
                {days.map((d, i) =>
                  d ? (
                    <button
                      key={i}
                      type="button"
                      id={i === days.findIndex(Boolean) ? "b-date" : undefined}
                      disabled={!dayHasSlots(d)}
                      aria-pressed={date === d}
                      aria-label={longDate(d)}
                      onClick={() => {
                        setDate(d);
                        setTime("");
                      }}
                      className="h-11 text-base tabular-nums transition-colors hover:bg-cream disabled:cursor-default disabled:text-ink/30 disabled:line-through disabled:decoration-ink/20 disabled:hover:bg-transparent aria-pressed:bg-primary aria-pressed:font-medium aria-pressed:text-primary-foreground"
                    >
                      {day(d).date()}
                    </button>
                  ) : (
                    <span key={i} />
                  )
                )}
              </div>
            </div>
            {fieldError("date")}
            {date ? (
              <div>
                <p className="text-[13px] font-medium">Start times on {longDate(date)}</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Start times">
                  {slots.map((s, i) => (
                    <button
                      key={s}
                      id={i === 0 ? "b-time" : undefined}
                      type="button"
                      aria-pressed={time === s}
                      onClick={() => setTime(s)}
                      className={`h-11 min-w-[88px] ${toggleBtn}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {fieldError("time")}
              </div>
            ) : (
              <p>Days you can book are shown in ink. We are closed on Mondays.</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary" type="button" onClick={nextFromDate}>
                Add your details
              </button>
              <button className="btn-secondary" type="button" onClick={() => goTo(1)}>
                Change treatment
              </button>
            </div>
          </div>
        )}

        {step === 3 && t && (
          <form className="grid gap-5" onSubmit={submit} noValidate>
            <h2 tabIndex={-1} ref={headRef} className={stepTitle}>
              <span className={stepNo}>3 of 3</span>Your details and deposit
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="b-name" className="field-label">
                  Name
                </label>
                <input
                  id="b-name"
                  type="text"
                  autoComplete="name"
                  value={details.name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "b-name-err" : undefined}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className={inputCls("name")}
                />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="b-phone" className="field-label">
                  Mobile number
                </label>
                <input
                  id="b-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={details.phone}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "b-phone-err" : undefined}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className={inputCls("phone")}
                />
                {fieldError("phone")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-email" className="field-label">
                  Email
                </label>
                <input
                  id="b-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={details.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "b-email-err" : undefined}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className={inputCls("email")}
                />
                {fieldError("email")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-notes" className="field-label">
                  Anything Zee should know (optional)
                </label>
                <textarea
                  id="b-notes"
                  rows={3}
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  className="field-input h-auto py-3"
                />
              </div>
            </div>
            <label className="grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3">
              <input
                type="checkbox"
                checked={details.newClient}
                onChange={(e) => setDetails({ ...details, newClient: e.target.checked })}
                className="mt-1 h-[18px] w-[18px] accent-primary-dark"
              />
              <span>This is my first time at LashesByZee (Zee will arrange your free patch test first)</span>
            </label>

            {depositDue ? (
              <fieldset>
                <legend className="mb-1 mt-4 text-[13px] font-medium">
                  Deposit of £{depositDue}, taken off the price on the day
                </legend>
                {cardEnabled && (
                  <label className={choiceRow}>
                    <input
                      type="radio"
                      name="deposit"
                      checked={depositMethod === "card"}
                      onChange={() => setDepositMethod("card")}
                      className={radio}
                    />
                    <span className="choice-name font-medium">Pay by card now</span>
                    <span className="font-medium tabular-nums">£{depositDue}</span>
                    <span className="col-start-2 text-muted">Secure payment through Stripe; your time is held at once</span>
                  </label>
                )}
                <label className={choiceRow}>
                  <input
                    type="radio"
                    name="deposit"
                    checked={depositMethod === "transfer"}
                    onChange={() => setDepositMethod("transfer")}
                    className={radio}
                  />
                  <span className="choice-name font-medium">Pay by bank transfer</span>
                  <span className="font-medium tabular-nums">£{depositDue}</span>
                  <span className="col-start-2 text-muted">Within 24 hours of Zee&rsquo;s confirmation email</span>
                </label>
              </fieldset>
            ) : null}

            <div>
              <label className="grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3">
                <input
                  id="b-policy"
                  type="checkbox"
                  checked={policy}
                  aria-invalid={errors.policy ? true : undefined}
                  aria-describedby={errors.policy ? "b-policy-err" : undefined}
                  onChange={(e) => setPolicy(e.target.checked)}
                  className="mt-1 h-[18px] w-[18px] accent-primary-dark"
                />
                <span>
                  I agree to the{" "}
                  <a href="#policy" className="underline underline-offset-4 transition-colors hover:text-primary">
                    booking and cancellation policy
                  </a>
                </span>
              </label>
              {fieldError("policy")}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary" type="submit" disabled={busy} aria-busy={busy || undefined}>
                Book an appointment
              </button>
              <button className="btn-secondary" type="button" onClick={() => goTo(2)}>
                Change the time
              </button>
            </div>
          </form>
        )}

        {step === 4 && done && t && (
          <div className="grid max-w-[640px] gap-5">
            <h2 tabIndex={-1} ref={headRef} className={stepTitle}>
              Your appointment request is in
            </h2>
            <p className="lead">
              {t.name} on {longDate(date)} at {time}. Your reference is <b className="font-medium">{done.ref}</b>, and a
              copy is in your inbox.
            </p>
            {done.depositDue ? (
              <p>
                Zee will email to confirm your time with her bank details. Pay the £{done.depositDue} deposit within 24
                hours, using {done.ref} as the reference, and your appointment is secured.
              </p>
            ) : (
              <p>Zee will email to confirm your time.</p>
            )}
            <Link href="/services" className="link-arrow self-start">
              See aftercare and infills
            </Link>
          </div>
        )}

        <p className="min-h-[1.5em] text-sm empty:min-h-0" role="status">
          {status}
        </p>
      </div>

      {step !== 4 && (
        <aside className="grid gap-5 bg-cream p-5 sm:p-8 lg:p-12" aria-label="Your booking">
          <h2 className="text-[28px]">Your booking</h2>
          <dl>
            {[
              ["Treatment", t ? t.name : "Not chosen yet"],
              ["Time", t ? formatDuration(t.minutes) : "-"],
              ["Day", date ? `${longDate(date)}${time ? `, ${time}` : ""}` : "Not chosen yet"],
              ["Price", t ? formatPrice(t.price) : "-"],
              ["Deposit today", t ? (depositDue ? `£${depositDue}` : "None") : "-"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-ink/10 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p>The rest is paid in the studio, by card or cash.</p>
        </aside>
      )}
    </div>
  );
}
