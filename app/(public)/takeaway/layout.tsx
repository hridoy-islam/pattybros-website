import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Click & Collect",

  description:
    "Order Patty Bros takeaway and enjoy our juicy smash burgers, loaded fries, chicken burgers, and street food favourites from the comfort of your home in London.",

  keywords: [
    "Patty Bros Takeaway",
    "Burger Takeaway London",
    "Smash Burger Delivery UK",
    "Order Burgers Online London",
    "Loaded Fries Takeaway",
    "Chicken Burger Delivery London",
    "Peckham Burger Takeaway",
    "London Street Food Delivery",
  ],

  openGraph: {
    title: "Click & Collect | Patty Bros Smash Burgers",
    description:
      "Get your favourite Patty Bros smash burgers, loaded fries, and street food favourites delivered or ready for takeaway in London.",
    url: "https://patty-bros.co.uk/takeaway",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Takeaway Smash Burgers",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Takeaway | Patty Bros Smash Burgers",
    description:
      "Order fresh smash burgers, loaded fries, and street food favourites from Patty Bros London.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://patty-bros.co.uk/takeaway",
  },
};


export default function TakeAwayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}