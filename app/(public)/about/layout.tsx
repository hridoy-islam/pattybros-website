import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "About Us",

  description:
    "Learn more about Cyberpeers — a UK-based digital marketing and technology agency helping brands grow through web development, SEO, branding, UI/UX design, and performance marketing.",

  keywords: [
    "About Cyberpeers",
    "Cyberpeers Team",
    "Digital Marketing Experts UK",
    "Web Development Agency UK",
    "SEO Specialists",
    "Performance Marketing Agency",
    "Creative Tech Team",
    "Brand Strategy Agency",
  ],

  openGraph: {
    title: "About Cyberpeers | Digital Marketing & Tech Agency",
    description:
      "Discover the team, mission, and vision behind Cyberpeers. We combine technology, creativity, and strategy to help businesses scale with measurable results.",
    url: "https://cyberpeers.co.uk/about",
    siteName: "Cyberpeers",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "About Cyberpeers Digital Marketing & Tech Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Cyberpeers | Digital Marketing & Tech Agency",
    description:
      "Meet the experts behind Cyberpeers — delivering innovative web, SEO, branding, and marketing solutions.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://cyberpeers.co.uk/about",
  },
};


export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}