import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Career",

  description:
    "Join the Cyberpeers team and build your career in digital marketing, web development, UI/UX design, and performance marketing. Explore exciting opportunities and grow with us.",

  keywords: [
    "Cyberpeers Careers",
    "Jobs at Cyberpeers",
    "Digital Marketing Jobs UK",
    "Web Developer Jobs",
    "UI UX Designer Careers",
    "Performance Marketing Jobs",
    "Tech Agency Careers",
    "Marketing Agency Jobs UK",
  ],

  openGraph: {
    title: "Careers at Cyberpeers | Join Our Team",
    description:
      "We're hiring! Explore career opportunities at Cyberpeers in development, design, SEO, branding, and marketing.",
    url: "https://cyberpeers.co.uk/career",
    siteName: "Cyberpeers",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Careers at Cyberpeers Digital Marketing & Tech Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Careers at Cyberpeers | Join Our Team",
    description:
      "Discover open roles at Cyberpeers and grow your career in tech and digital marketing.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://cyberpeers.co.uk/career",
  },
};



export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}