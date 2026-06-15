import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Book a Table at Patty Bros Peckham | Smash Burger Restaurant",

  description:
    "Reserve your table at Patty Bros in Peckham and enjoy freshly made smash burgers, loaded fries and quality comfort food in a relaxed dining atmosphere",

  keywords: [
    "Book Patty Bros Table",
    "Smash Burger Reservation Peckham",
    "Restaurant Booking London",
    "Patty Bros Booking System",
    "Peckham Burger Restaurant",
    "Dine In Smash Burgers London",
    "Burger Table Booking UK",
    "London Restaurant Reservation",
  ],

  openGraph: {
    title: "Book a Table at Patty Bros Peckham | Smash Burger Restaurant",
    description:
      "Reserve your table at Patty Bros in Peckham and enjoy freshly made smash burgers, loaded fries and quality comfort food in a relaxed dining atmosphere",
    url: "https://www.patty-bros.co.uk/book-a-table",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Table Booking",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Book a Table at Patty Bros Peckham | Smash Burger Restaurant",
    description:
      "Reserve your table at Patty Bros Peckham and enjoy fresh smash burgers, loaded fries and comfort food.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk/book-a-table",
  },
};
export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}