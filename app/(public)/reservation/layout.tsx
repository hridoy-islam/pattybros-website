import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Reservation",
  description:
    "Book a table at Patty Bros, London’s favourite smash burger restaurant. Reserve your spot for fresh burgers, loaded fries, and a premium street food dining experience.",
  keywords: [
    "Patty Bros Reservation",
    "Book Table London Burger Restaurant",
    "Smash Burger Booking UK",
    "Restaurant Reservation London",
    "Peckham Burger Table Booking",
    "London Food Reservation",
    "Burger Restaurant Booking System",
    "Dine In Patty Bros",
  ],

  openGraph: {
    title: "Reserve a Table | Patty Bros",
    description:
      "Book your table at Patty Bros and enjoy fresh smash burgers, loaded fries, and street food favourites in London.",
    url: "https://patty-bros.co.uk/reservation",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Table Reservation",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Reserve a Table | Patty Bros",
    description:
      "Book your table at Patty Bros London and enjoy premium smash burgers and street food.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://patty-bros.co.uk/reservation",
  },
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}