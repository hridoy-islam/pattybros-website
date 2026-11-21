"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" to a local Date at midnight (no time-zone shift) */
const toDate = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};

/** a local Date to "YYYY-MM-DD" */
const toIso = (d: Date | null) => (d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "");

type Props = {
  id?: string;
  /** the date as "YYYY-MM-DD" ("" for none); shown to the user as dd-mm-yyyy */
  value: string;
  onChange: (iso: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

// A date field on react-datepicker, typed and shown as dd-mm-yyyy, with the shadcn Input as its field.
// The value in and out stays "YYYY-MM-DD", as the API stores it.
export function DatePicker({ id, value, onChange, minDate, maxDate, placeholder = "dd-mm-yyyy", invalid, disabled, className, ...rest }: Props) {
  return (
    <div className={cn("relative w-full", className)}>
      <ReactDatePicker
        id={id}
        selected={toDate(value)}
        onChange={(d: Date | null) => onChange(toIso(d))}
        dateFormat="dd-MM-yyyy"
        placeholderText={placeholder}
        minDate={minDate ? toDate(minDate) ?? undefined : undefined}
        maxDate={maxDate ? toDate(maxDate) ?? undefined : undefined}
        calendarStartDay={1}
        showPopperArrow={false}
        disabled={disabled}
        autoComplete="off"
        wrapperClassName="w-full"
        popperClassName="adm-datepicker"
        popperPlacement="bottom-start"
        customInput={<Input className="pr-10" aria-invalid={invalid || undefined} aria-label={rest["aria-label"]} />}
      />
      <CalendarDays aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" />
    </div>
  );
}
