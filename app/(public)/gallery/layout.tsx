import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the Patty Bros gallery showcasing our smash burgers, loaded fries, drinks, and delicious street food from our London restaurant. See what makes our food special.",
  keywords: [
    "Patty Bros Gallery",
    "Smash Burger Photos",
    "London Burger Restaurant Images",
    "Burger Shop Peckham Gallery",
    "Street Food London Photos",
    "Food Gallery UK",
    "Burger Restaurant Visuals",
  ],
  openGraph: {
    title: "Patty Bros Gallery | Smash Burgers & Street Food",
    description:
      "Take a look at Patty Bros’ gallery featuring juicy smash burgers, loaded fries, and our signature London street food experience.",
    url: "https://patty-bros.co.uk/gallery",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Food Gallery",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patty Bros Gallery",
    description:
      "Browse our smash burgers, loaded fries, and street food creations in our London gallery.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://patty-bros.co.uk/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}