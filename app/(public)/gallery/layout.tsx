import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Patty Bros Gallery | Smash Burger Photos in Peckham",

  description:
    "View Patty Bros food photos, including smash burgers, crispy edges, melted cheese, loaded fries, signature sauces and street food favourites.",

  keywords: [
    "Patty Bros Gallery",
    "Smash Burger Photos Peckham",
    "Burger Restaurant Photos London",
    "Street Food Gallery Peckham",
    "Loaded Fries Photos",
    "Smash Burgers UK",
    "Food Photography London",
    "Patty Bros Food Images",
  ],

  openGraph: {
    title: "Patty Bros Gallery | Smash Burger Photos in Peckham",
    description:
      "View Patty Bros food photos, including smash burgers, crispy edges, melted cheese, loaded fries, signature sauces and street food favourites.",
    url: "https://www.patty-bros.co.uk/gallery",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Smash Burger Gallery",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Patty Bros Gallery | Smash Burger Photos in Peckham",
    description:
      "Browse Patty Bros smash burgers, loaded fries, and street food photography from Peckham.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}