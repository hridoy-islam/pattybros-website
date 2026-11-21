"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { DepositBadge, fmtDate, fmtDateTime, fmtMinutes, Loading, StatusBadge, timeOptions } from "@/components/admin/ui/bits";
import { Field } from "@/components/admin/ui/Field";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Booking, BookingStatus } from "@/types";

const NEXT_ACTIONS: Record<BookingStatus, { status: BookingStatus; label: string; variant: ButtonProps["variant"] }[]> = {
  pending: [
    { status: "confirmed", label: "Confirm booking", variant: "default" },
    { status: "cancelled", label: "Cancel booking", variant: "destructive" },
  ],
  confirmed: [
    { status: "completed", label: "Mark as completed", variant: "default" },
    { status: "cancelled", label: "Cancel booking", variant: "destructive" },
  ],
  completed: [],
  cancelled: [{ status: "pending", label: "Reopen booking", variant: "outline" }],
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [b, setB] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [moveTime, setMoveTime] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/bookings/${id}`)
      .then((r) => {
        setB(r.data.data);
        setNotes(r.data.data.notes || "");
        setMoveDate(r.data.data.date);
        setMoveTime(r.data.data.time);
      })
      .catch((e) => toast({ title: "Error", description: apiError(e, "Booking not found"), variant: "destructive" }));
  }, [id, toast]);

  const update = async (patch: Partial<Booking>, done: string) => {
    setSaving(true);
    try {
      const r = await axiosInstance.patch(`/bookings/${id}`, patch);
      setB(r.data.data);
      toast({ title: done });
    } catch (e) {
      toast({ title: "Error", description: apiError(e, "Could not save"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!b || !window.confirm(`Delete booking ${b.ref}? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      toast({ title: "Booking deleted" });
      router.replace("/admin/bookings");
    } catch (e) {
      toast({ title: "Error", description: apiError(e), variant: "destructive" });
    }
  };

  if (!b) return <Loading />;

  return (
    <>
      <Link className="crumb" href="/admin/bookings">
        &larr; All bookings
      </Link>
      <div className="head">
        <div>
          <h1>{b.customerName}</h1>
          <p>
            {b.ref} · booked {fmtDateTime(b.createdAt)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {NEXT_ACTIONS[b.status].map((a) => (
            <Button
              key={a.status}
              variant={a.variant}
              type="button"
              disabled={saving}
              onClick={() => update({ status: a.status }, `Booking ${a.status}`)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="two">
        <div>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Appointment</h2>
            <dl className="dl">
              <dt>Status</dt>
              <dd>
                <StatusBadge status={b.status} />
              </dd>
              <dt>Treatment</dt>
              <dd>
                {b.serviceName} ({fmtMinutes(b.minutes)})
              </dd>
              <dt>When</dt>
              <dd>
                {fmtDate(b.date)} at {b.time}
              </dd>
              <dt>Price</dt>
              <dd>{b.price ? `£${b.price}` : "Free"}</dd>
              <dt>New client</dt>
              <dd>{b.newClient ? "Yes, patch test needed first" : "No"}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Move the appointment</h2>
            <div className="form-grid">
              <Field label="Date" htmlFor="moveDate">
                <DatePicker id="moveDate" value={moveDate} onChange={setMoveDate} />
              </Field>
              <Field label="Time" htmlFor="moveTime">
                <Select value={moveTime} onValueChange={setMoveTime}>
                  <SelectTrigger id="moveTime">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions(moveTime).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Button
                variant="dark"
                type="button"
                disabled={saving || !moveDate || (moveDate === b.date && moveTime === b.time)}
                onClick={() => update({ date: moveDate, time: moveTime }, "Appointment moved")}
              >
                Save new time
              </Button>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Notes</h2>
            <Textarea aria-label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div style={{ marginTop: 12 }}>
              <Button
                variant="dark"
                type="button"
                disabled={saving || notes === b.notes}
                onClick={() => update({ notes }, "Notes saved")}
              >
                Save notes
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Client</h2>
            <dl className="dl" style={{ gridTemplateColumns: "1fr" }}>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${b.customerEmail}`}>{b.customerEmail}</a>
              </dd>
              <dt>Mobile</dt>
              <dd>
                <a href={`tel:${b.customerPhone.replace(/\s/g, "")}`}>{b.customerPhone}</a>
              </dd>
            </dl>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Deposit</h2>
            <p style={{ margin: "0 0 12px" }}>
              <DepositBadge amount={b.depositAmount} paid={b.depositPaid} />{" "}
              {b.depositAmount ? `by ${b.depositMethod === "card" ? "card" : "bank transfer"}` : ""}
            </p>
            {b.depositAmount > 0 && (
              <Button
                variant={b.depositPaid ? "outline" : "default"}
                type="button"
                disabled={saving}
                onClick={() => update({ depositPaid: !b.depositPaid }, b.depositPaid ? "Deposit marked unpaid" : "Deposit marked paid")}
              >
                {b.depositPaid ? "Mark as not paid" : "Mark deposit paid"}
              </Button>
            )}
          </div>
          <div className="card">
            <Button variant="destructive" type="button" onClick={remove}>
              Delete booking
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
