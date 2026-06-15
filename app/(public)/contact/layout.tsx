import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Patty Bros Peckham | Burger Shop on Rye Lane",

  description:
    "Visit Patty Bros at Unit 10, The Aylesham Shopping Centre, Rye Lane, Peckham, London SE15 5EW for smash burgers, loaded fries and street food.",

  keywords: [
    "Contact Patty Bros",
    "Patty Bros Peckham Contact",
    "Smash Burger London Contact",
    "Burger Shop Rye Lane",
    "Peckham Burger Restaurant",
    "Food Order Contact London",
    "Burger Delivery Support UK",
  ],

  openGraph: {
    title: "Contact Patty Bros Peckham | Burger Shop on Rye Lane",
    description:
      "Visit or contact Patty Bros at Unit 10, The Aylesham Shopping Centre, Rye Lane, Peckham, London SE15 5EW for smash burgers, loaded fries and street food.",
    url: "https://www.patty-bros.co.uk/contact",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact Patty Bros Peckham",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Patty Bros Peckham | Burger Shop on Rye Lane",
    description:
      "Visit Patty Bros in Peckham at Rye Lane for smash burgers, loaded fries and street food.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
