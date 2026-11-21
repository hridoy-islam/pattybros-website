"use client";

import { useEffect, useState } from "react";
import axiosInstance, { apiError } from "@/lib/axios";
import { useToast } from "@/components/admin/ui/Toast";
import { Loading } from "@/components/admin/ui/bits";
import { Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudioSettings } from "@/types";

// The studio's company profile: contact details, deposit rules and opening hours
export default function StudioSettingsPage() {
  const { toast } = useToast();
  const [s, setS] = useState<StudioSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance.get("/settings").then((r) => setS(r.data.data));
  }, []);

  if (!s) return <Loading />;
  const set = <K extends keyof StudioSettings>(k: K, v: StudioSettings[K]) => setS({ ...s, [k]: v });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await axiosInstance.patch("/settings", s);
      setS(r.data.data);
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({ title: "Error", description: apiError(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="head">
        <div>
          <h1>Studio settings</h1>
          <p>Contact details, deposit rules and opening hours.</p>
        </div>
      </div>
      <form onSubmit={save} noValidate>
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Studio</h2>
          <div className="form-grid">
            <Field label="Studio name" htmlFor="studioName">
              <Input id="studioName" value={s.studioName} onChange={(e) => set("studioName", e.target.value)} />
            </Field>
            <Field label="Tagline" htmlFor="tagline">
              <Input id="tagline" value={s.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Business email" htmlFor="businessEmail">
              <Input id="businessEmail" type="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Business phone" htmlFor="businessPhone">
              <Input id="businessPhone" type="tel" value={s.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Instagram username" htmlFor="instagramUsername">
              <Input id="instagramUsername" placeholder="lashesbyzee" value={s.instagram} onChange={(e) => set("instagram", e.target.value)} />
            </Field>
            <Field label="Area" htmlFor="area">
              <Input id="area" value={s.area} onChange={(e) => set("area", e.target.value)} />
            </Field>
            <Field label="Location line" htmlFor="locationLine" className="wide">
              <Input id="locationLine" value={s.areaLine} onChange={(e) => set("areaLine", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Deposits and cancelling</h2>
          <div className="form-grid">
            <Field label="Deposit (£)" htmlFor="deposit">
              <Input id="deposit" type="number" min={0} value={s.depositAmount} onChange={(e) => set("depositAmount", Number(e.target.value))} />
            </Field>
            <Field label="Notice needed to cancel (hours)" htmlFor="noticeNeededToCancelHours">
              <Input id="noticeNeededToCancelHours" type="number" min={0} value={s.cancellationHours} onChange={(e) => set("cancellationHours", Number(e.target.value))} />
            </Field>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Opening hours</h2>
          <div className="form-grid">
            {s.hours.map((h, i) => (
              <div className="grid content-start gap-1.5" key={h.label}>
                <Label htmlFor={`hours-${i}`}>{h.label}</Label>
                <Input id={`hours-${i}`} value={h.time} onChange={(e) => set("hours", s.hours.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving" : "Save settings"}
          </Button>
        </div>
      </form>
    </>
  );
}
