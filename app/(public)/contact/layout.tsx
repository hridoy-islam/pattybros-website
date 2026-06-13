import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Patty Bros, a smash burger restaurant in London. Contact us for orders, delivery inquiries, catering, feedback, or general support.",
  keywords: [
    "Contact Patty Bros",
    "Smash Burger London Contact",
    "Burger Restaurant Support UK",
    "Patty Bros Contact Details",
    "London Burger Delivery Contact",
    "Peckham Burger Shop Contact",
    "Food Order Inquiry London",
  ],
  openGraph: {
    title: "Contact Patty Bros",
    description:
      "Reach out to Patty Bros for orders, delivery support, catering inquiries, or feedback. We're here to help you enjoy the best smash burgers in London.",
    url: "https://patty-bros.co.uk/contact",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact Patty Bros",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Patty Bros",
    description:
      "Get in touch with Patty Bros for orders, delivery, catering, or support in London.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://patty-bros.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
