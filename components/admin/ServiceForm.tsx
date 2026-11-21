"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckField, Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceItem } from "@/types";

export type ServiceInput = Omit<ServiceItem, "_id" | "slug" | "order">;

export const emptyService: ServiceInput = {
  name: "",
  group: "sets",
  minutes: 120,
  price: 0,
  short: "",
  description: "",
  suitableFor: "",
  image: "",
  popular: false,
  active: true,
};

export default function ServiceForm({
  initial,
  submitLabel,
  onSubmit,
  extraActions,
}: {
  initial: ServiceInput;
  submitLabel: string;
  onSubmit: (v: ServiceInput) => Promise<void>;
  /** more buttons at the right of the form's foot (the edit page's Delete) */
  extraActions?: React.ReactNode;
}) {
  const [v, setV] = useState<ServiceInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ServiceInput>(k: K, val: ServiceInput[K]) => setV((x) => ({ ...x, [k]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (v.name.trim().length < 2) er.name = "Give the treatment a name";
    if (!(v.minutes > 0)) er.minutes = "Write the length in minutes";
    if (v.price < 0) er.price = "The price cannot be below zero";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    try {
      await onSubmit(v);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <Input id="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name || undefined} />
        </Field>
        <Field label="Group" htmlFor="group">
          <Select value={v.group} onValueChange={(g) => set("group", g as ServiceInput["group"])}>
            <SelectTrigger id="group">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sets">Full sets</SelectItem>
              <SelectItem value="infills">Infills</SelectItem>
              <SelectItem value="other">Removal and patch test</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Length (minutes)" htmlFor="minutes" error={errors.minutes}>
          <Input
            id="minutes"
            type="number"
            min={5}
            step={5}
            value={v.minutes}
            onChange={(e) => set("minutes", Number(e.target.value))}
            aria-invalid={!!errors.minutes || undefined}
          />
        </Field>
        <Field label="Price (£)" htmlFor="price" error={errors.price}>
          <Input
            id="price"
            type="number"
            min={0}
            step={1}
            value={v.price}
            onChange={(e) => set("price", Number(e.target.value))}
            aria-invalid={!!errors.price || undefined}
          />
        </Field>
        <Field label="One-line summary" htmlFor="short" className="wide">
          <Input id="short" value={v.short} onChange={(e) => set("short", e.target.value)} />
        </Field>
        <Field label="Description" htmlFor="description" className="wide">
          <Textarea id="description" value={v.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Suitable for" htmlFor="suitableFor" className="wide">
          <Textarea id="suitableFor" value={v.suitableFor} onChange={(e) => set("suitableFor", e.target.value)} />
        </Field>
        <Field label="Photograph path" htmlFor="image" className="wide">
          <Input id="image" placeholder="/images/set-classic.jpg" value={v.image} onChange={(e) => set("image", e.target.value)} />
        </Field>
        {v.image ? <img src={v.image} alt="" className="aspect-[4/3] w-40 rounded-md object-cover" /> : null}
        <div className="wide grid gap-3">
          <CheckField id="popular" label="Show as a popular set">
            <Checkbox id="popular" checked={v.popular} onCheckedChange={(c) => set("popular", c === true)} />
          </CheckField>
          <CheckField id="active" label="Bookable online">
            <Checkbox id="active" checked={v.active} onCheckedChange={(c) => set("active", c === true)} />
          </CheckField>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving" : submitLabel}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/services">Cancel</Link>
        </Button>
        {extraActions ? <div className="ml-auto">{extraActions}</div> : null}
      </div>
    </form>
  );
}
