import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Patty Bros | Proper Smash Burgers in Peckham, London",
  description:
    "Learn about Patty Bros, a Peckham burger shop serving smash burgers made with British aged beef, fresh toppings, toasted potato buns, and signature sauces.",
  keywords: [
    "About Patty Bros",
    "Proper Smash Burgers Peckham",
    "Smash Burger London",
    "Patty Bros Peckham",
    "Burger Shop London",
    "British Aged Beef Burgers",
    "London Street Food",
    "Signature Smash Burgers",
    "Patty Bros UK",
  ],
  openGraph: {
    title: "About Patty Bros | Proper Smash Burgers in Peckham, London",
    description:
      "Learn about Patty Bros, a Peckham burger shop serving smash burgers made with British aged beef, fresh toppings, toasted potato buns, and signature sauces.",
    url: "https://www.patty-bros.co.uk/about-us",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros About Us Page",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Patty Bros | Proper Smash Burgers in Peckham, London",
    description:
      "Discover Patty Bros, a Peckham burger shop serving premium smash burgers with British aged beef, fresh toppings, toasted potato buns, and signature sauces.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://www.patty-bros.co.uk/about-us",
  },
};


export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}