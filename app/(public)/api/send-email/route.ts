import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function POST(req: Request) {
  try {
    // Synchronized to perfectly match the frontend form fields
    const { name, email, subject, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, 
      auth: {
        user: "info@patty-bros.co.uk", 
        pass: "Admin4London@", 
      },
    });

    const templatePath = path.join(
      process.cwd(),
      "static/email_template/contact_template.ejs"
    );

    // Context passing variables over to your administrative EJS layout
    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      subject,
      phone,
      message,
    });

    const mailOptions = {
      from: `"Patty Bro's" <info@patty-bros.co.uk>`, 
      to: "info@patty-bros.co.uk",
      // to: "mahitasnimul2@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (error: any) {
    console.error("Internal Email error:", error);
    return NextResponse.json({ success: false, message: error?.message || error }, { status: 500 });
  }
}