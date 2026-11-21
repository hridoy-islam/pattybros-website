// Settings written here for now instead of in a .env file. Fill each one in when it is known.
// This file is imported only by server code (the API routes and server pages), so these values are never
// sent to the browser. Do not import it from a "use client" file.
// Keep real passwords and keys out of git: once they are filled in, a .env file is the safer place.

/** Email: where booking and contact emails go, and the SMTP account that sends them. */
export const mail = {
  studioEmail: "", // Zee's inbox, e.g. hello@lashesbyzee.com
  smtpHost: "", // e.g. smtp.gmail.com, smtp.zoho.eu
  smtpPort: 465,
  smtpUser: "",
  smtpPass: "",
};

/** Stripe secret key for card deposits through Stripe Checkout. Empty: card is off, clients pay by bank transfer. */
export const stripeSecretKey = "";
