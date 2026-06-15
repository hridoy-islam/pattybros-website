import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Click & Collect Smash Burgers in Peckham | Patty Bros",

  description:
    "Order Patty Bros online for quick click and collect in Peckham. Fresh smash burgers, loaded fries and comfort food prepared for easy collection.",

  keywords: [
    "Patty Bros Click & Collect",
    "Smash Burgers Peckham",
    "Burger Collection London",
    "Order Burgers Online Peckham",
    "Loaded Fries Peckham",
    "Street Food South East London",
    "Patty Bros Takeaway",
    "Comfort Food London",
    "Fresh Burgers London",
  ],

  openGraph: {
    title: "Click & Collect Smash Burgers in Peckham | Patty Bros",
    description:
      "Order Patty Bros online for quick click and collect in Peckham. Fresh smash burgers, loaded fries and comfort food prepared for easy collection.",
    url: "https://www.patty-bros.co.uk/click-and-collect",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Click & Collect Smash Burgers",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Click & Collect Smash Burgers in Peckham | Patty Bros",
    description:
      "Order fresh smash burgers, loaded fries and comfort food from Patty Bros for quick collection in Peckham, London.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk/click-and-collect",
  },
};


export default function TakeAwayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}