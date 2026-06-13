import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function POST(req: Request) {
  try {
    // Pull context sent down by your client-side hook
    const { name, email } = await req.json();

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
      "static/email_template/contact_user_template.ejs"
    );
    
    const html = await ejs.renderFile(templatePath, {
      name,
      email,
    });

    const mailOptions = {
      from: `"Patty Bro's" <info@patty-bros.co.uk>`, 
      to: email, 
      subject: `Thank You for Contacting Patty Bro's`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (error: any) {
    console.error("User Confirmation Email error:", error);
    return NextResponse.json({ success: false, message: error?.message || error }, { status: 500 });
  }
}