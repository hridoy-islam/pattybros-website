import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function POST(req: Request) {
  try {
    // 1. Updated to match your frontend form schema
    const { name, email, phone, service, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.co.uk",
      port: 587,
      secure: false,
      auth: {
        user: "contact@cyberpeers.co.uk",
        pass: "4FROdCo?!)tT", // Tip: Move this to process.env.SMTP_PASSWORD later!
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const templatePath = path.join(
      process.cwd(),
      "static/email_template/contact_template.ejs"
    );

    // 2. Pass the correct variables to your EJS template
    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      phone,
      service,
      message,
    });

    const mailOptions = {
      from: `"Cyberpeers" <contact@cyberpeers.co.uk>`, 
      to: "contact@cyberpeers.co.uk",
      subject: `New Contact Form Submission from ${name}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}