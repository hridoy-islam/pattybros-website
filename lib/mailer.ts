import nodemailer from "nodemailer";
import { mail } from "@/lib/config";

export function mailConfigured() {
  return Boolean(mail.smtpHost && mail.smtpUser && mail.smtpPass && mail.studioEmail);
}

/**
 * Sends one email. Without SMTP settings (lib/config.ts) it logs the message in development (so the flow can be tried
 * locally) and throws in production, so a visitor never sees a confirmation for a message that went nowhere.
 */
export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[mail:dev] to ${opts.to}\nsubject: ${opts.subject}\n${opts.text}\n`);
      return;
    }
    throw new Error("Email is not configured");
  }
  const port = mail.smtpPort || 465;
  const transport = nodemailer.createTransport({
    host: mail.smtpHost,
    port,
    secure: port === 465,
    auth: { user: mail.smtpUser, pass: mail.smtpPass },
  });
  await transport.sendMail({
    from: `LashesByZee <${mail.smtpUser}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}

export const studioEmail = () => mail.studioEmail || "studio@lashesbyzee.example";
