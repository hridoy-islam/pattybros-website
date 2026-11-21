import nodemailer from "nodemailer";

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.STUDIO_EMAIL);
}

/**
 * Sends one email. Without SMTP settings it logs the message in development (so the flow can be tried
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
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: `LashesByZee <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}

export const studioEmail = () => process.env.STUDIO_EMAIL || "studio@lashesbyzee.example";
