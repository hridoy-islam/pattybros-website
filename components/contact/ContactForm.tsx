"use client";

import { useState } from "react";

type Fields = { name: string; email: string; message: string };
const empty: Fields = { name: "", email: "", message: "" };

// Posts to /api/contact, which emails the studio. Errors show under each field; success only after a real send.
export default function ContactForm() {
  const [v, setV] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Fields> = {};
    if (v.name.trim().length < 2) er.name = "Write your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) er.email = "Write an email address with an @, like name@example.com.";
    if (v.message.trim().length < 5) er.message = "Write your question for Zee.";
    setErrors(er);
    const n = Object.keys(er).length;
    if (n) {
      setStatus(n === 1 ? "1 field to fix." : `${n} fields to fix.`);
      document.getElementById(`c-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setStatus("Sending");
    try {
      const body = new FormData();
      Object.entries(v).forEach(([k, val]) => body.append(k, val));
      const res = await fetch("/api/contact", { method: "POST", body });
      if (!res.ok) throw new Error();
      setV(empty);
      setStatus("Your message is in. Zee replies within a day.");
    } catch {
      setStatus("Not sent: the connection failed. Your words are still here; try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = (k: keyof Fields, label: string, input: React.ReactNode) => (
    <div>
      <label htmlFor={`c-${k}`} className="field-label">
        {label}
      </label>
      {input}
      {errors[k] && (
        <p id={`c-${k}-err`} className="field-error">
          {errors[k]}
        </p>
      )}
    </div>
  );

  const cls = (k: keyof Fields) => `field-input ${errors[k] ? "border-2 border-red-800" : ""}`;
  const aria = (k: keyof Fields) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `c-${k}-err` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      {field(
        "name",
        "Name",
        <input id="c-name" type="text" autoComplete="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className={cls("name")} {...aria("name")} />
      )}
      {field(
        "email",
        "Email",
        <input id="c-email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} className={cls("email")} {...aria("email")} />
      )}
      {field(
        "message",
        "Message",
        <textarea id="c-message" rows={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} className={`${cls("message")} h-auto py-3`} {...aria("message")} />
      )}
      <div>
        <button className="btn-secondary w-full sm:w-auto" type="submit" disabled={busy}>
          Send a message
        </button>
      </div>
      <p role="status" className="min-h-[1.5em] text-sm">
        {status}
      </p>
      <p className="text-sm">Zee replies within a day.</p>
    </form>
  );
}
