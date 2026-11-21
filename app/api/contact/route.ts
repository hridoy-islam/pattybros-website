import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail, studioEmail } from "@/lib/mailer";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(5).max(2000),
});

// The contact form (posted by the design kit's form runner as FormData)
export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = schema.safeParse({ name: form.get("name"), email: form.get("email"), message: form.get("message") });
  if (!parsed.success) return NextResponse.json({ error: "Check the form and try again." }, { status: 400 });
  const { name, email, message } = parsed.data;
  try {
    await sendMail({
      to: studioEmail(),
      subject: `Website message from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
      replyTo: email,
    });
  } catch {
    return NextResponse.json({ error: "Not sent" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
