import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Explore the Patty Bros menu featuring juicy smash burgers, loaded fries, chicken burgers, sides, and drinks. Fresh, bold flavours served in London’s favourite burger spot.",
  keywords: [
    "Patty Bros Menu",
    "Smash Burger Menu London",
    "Burger Restaurant Menu UK",
    "Loaded Fries Menu",
    "Chicken Burgers London",
    "Best Burgers Peckham Menu",
    "Street Food Menu London",
    "Fast Food Menu UK",
  ],

  openGraph: {
    title: "Our Menu | Patty Bros Smash Burgers",
    description:
      "Discover the full Patty Bros menu — smash burgers, loaded fries, chicken burgers, sides, and drinks made with fresh premium ingredients in London.",
    url: "https://patty-bros.co.uk/menu",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Menu - Smash Burgers & Fries",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Our Menu | Patty Bros Smash Burgers",
    description:
      "Browse Patty Bros menu featuring smash burgers, loaded fries, chicken burgers, and more.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://patty-bros.co.uk/menu",
  },
};


export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}