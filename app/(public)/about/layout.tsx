import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Patty Bros, a modern smash burger restaurant in London. Discover our story, passion for bold flavours, fresh ingredients, and commitment to delivering premium street food experiences.",
  keywords: [
    "About Patty Bros",
    "Smash Burger London",
    "Burger Restaurant Story",
    "Patty Bros UK",
    "London Street Food Brand",
    "Burger Kitchen Peckham",
    "Our Story Patty Bros",
  ],
  openGraph: {
    title: "About Patty Bros | Our Story",
    description:
      "Discover the story behind Patty Bros – a London-based smash burger restaurant serving bold, juicy burgers and premium street food favourites.",
    url: "https://patty-bros.co.uk/about",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros About Page",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Patty Bros | Smash Burger Restaurant London",
    description:
      "Learn the story behind Patty Bros and our passion for smash burgers and street food in London.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://patty-bros.co.uk/about",
  },
};


export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}