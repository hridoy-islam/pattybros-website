import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Patty Bros Menu | Smash Burgers, Loaded Fries & Sides Peckham",
  description:
    "Explore the Patty Bros menu with smash burgers, melted cheese, loaded fries, sides, sauces and quality street food made fresh in Peckham, London.",

  keywords: [
    "Patty Bros Menu",
    "Smash Burger Menu Peckham",
    "Smash Burger London",
    "Loaded Fries Peckham",
    "Burger Sides London",
    "Street Food Peckham",
    "Quality Burgers London",
    "Chicken Burgers Peckham",
    "Burger Restaurant Menu UK",
    "Patty Bros Food Menu",
  ],

  openGraph: {
    title: "Patty Bros Menu | Smash Burgers, Loaded Fries & Sides Peckham",
    description:
      "Explore the Patty Bros menu with smash burgers, melted cheese, loaded fries, sides, sauces and quality street food made fresh in Peckham, London.",
    url: "https://www.patty-bros.co.uk/menu",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Menu - Smash Burgers, Loaded Fries & Sides",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Patty Bros Menu | Smash Burgers, Loaded Fries & Sides Peckham",
    description:
      "Browse Patty Bros menu featuring smash burgers, loaded fries, sauces, sides and fresh street food made in Peckham, London.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk/menu",
  },
};


export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}