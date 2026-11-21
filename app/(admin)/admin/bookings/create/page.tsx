"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { fmtMinutes, timeOptions } from "@/components/admin/ui/bits";
import { CheckField, Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceItem } from "@/types";

// A booking taken by phone, DM or in person
export default function CreateBookingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    date: "",
    time: "10:00",
    depositMethod: "transfer",
    depositPaid: false,
    newClient: false,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance.get("/services").then((r) => setServices(r.data.data.result.filter((s: ServiceItem) => s.active)));
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const text = (k: "customerName" | "customerEmail" | "customerPhone" | "notes") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(k, e.target.value);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.customerName.trim().length < 2) er.customerName = "Write the client's name";
    if (!form.serviceId) er.serviceId = "Choose a treatment";
    if (!form.date) er.date = "Choose a date";
    if (!form.customerEmail && !form.customerPhone) er.customerPhone = "Add an email or a mobile number";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    try {
      const r = await axiosInstance.post("/bookings", { ...form, status: "confirmed" });
      toast({ title: "Booking added", description: r.data.data.ref });
      router.push(`/admin/bookings/${r.data.data._id}`);
    } catch (err) {
      toast({ title: "Error", description: apiError(err), variant: "destructive" });
      setSaving(false);
    }
  };

  return (
    <>
      <Link className="crumb" href="/admin/bookings">
        &larr; All bookings
      </Link>
      <div className="head">
        <h1>Add a booking</h1>
      </div>
      <form className="card" onSubmit={submit} noValidate>
        <div className="form-grid">
          <Field label="Client name" htmlFor="customerName" error={errors.customerName}>
            <Input id="customerName" value={form.customerName} onChange={text("customerName")} aria-invalid={!!errors.customerName || undefined} />
          </Field>
          <Field label="Treatment" htmlFor="serviceId" error={errors.serviceId}>
            <Select value={form.serviceId} onValueChange={(v) => set("serviceId", v)}>
              <SelectTrigger id="serviceId" aria-invalid={!!errors.serviceId || undefined}>
                <SelectValue placeholder="Choose a treatment" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name} ({fmtMinutes(s.minutes)}, {s.price ? `£${s.price}` : "free"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Email" htmlFor="customerEmail">
            <Input id="customerEmail" type="email" value={form.customerEmail} onChange={text("customerEmail")} />
          </Field>
          <Field label="Mobile number" htmlFor="customerPhone" error={errors.customerPhone}>
            <Input id="customerPhone" type="tel" value={form.customerPhone} onChange={text("customerPhone")} aria-invalid={!!errors.customerPhone || undefined} />
          </Field>
          <Field label="Date" htmlFor="date" error={errors.date}>
            <DatePicker id="date" value={form.date} onChange={(v) => set("date", v)} invalid={!!errors.date} />
          </Field>
          <Field label="Time" htmlFor="time">
            <Select value={form.time} onValueChange={(v) => set("time", v)}>
              <SelectTrigger id="time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions(form.time).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Deposit paid by" htmlFor="depositMethod">
            <Select value={form.depositMethod} onValueChange={(v) => set("depositMethod", v)}>
              <SelectTrigger id="depositMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Bank transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="grid content-end gap-3">
            <CheckField id="depositPaid" label="Deposit already paid">
              <Checkbox id="depositPaid" checked={form.depositPaid} onCheckedChange={(c) => set("depositPaid", c === true)} />
            </CheckField>
            <CheckField id="newClient" label="New client (needs a patch test)">
              <Checkbox id="newClient" checked={form.newClient} onCheckedChange={(c) => set("newClient", c === true)} />
            </CheckField>
          </div>
          <Field label="Notes" htmlFor="notes" className="wide">
            <Textarea id="notes" value={form.notes} onChange={text("notes")} />
          </Field>
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving" : "Add booking"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/bookings">Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}
