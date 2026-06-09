import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",

  description:
    "Explore Cyberpeers' full range of digital services including web development, SEO, branding, UI/UX design, and performance marketing tailored for UK businesses.",

  keywords: [
    "Cyberpeers Services",
    "Digital Marketing Services UK",
    "Web Development Agency UK",
    "SEO Services UK",
    "Performance Marketing Agency",
    "Branding Agency UK",
    "UI UX Design Services",
    "Full Service Tech Agency",
  ],

  openGraph: {
    title: "Our Services | Cyberpeers Digital Marketing & Tech Agency",
    description:
      "Discover our expert digital solutions — web development, SEO, branding, UI/UX design, and performance marketing designed to scale modern businesses.",
    url: "https://cyberpeers.co.uk/services",
    siteName: "Cyberpeers",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Cyberpeers Digital Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Our Services | Cyberpeers",
    description:
      "Web development, SEO, branding & performance marketing services for ambitious UK businesses.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://cyberpeers.co.uk/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
