import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",

  description:
    "Contact Cyberpeers, a London-based digital marketing and web development agency located in Barking, UK.",

  keywords: [
    "Contact Cyberpeers",
    "London Digital Agency",
    "Web Development Agency London",
    "SEO Agency Barking",
    "Digital Marketing Agency UK",
    "Cyberpeers London Office",
    "Barking Web Design Company",
    "UK Tech Agency Contact",
  ],

  openGraph: {
    title: "Contact Cyberpeers | London Digital Marketing Agency",
    description:
      "Get in touch with Cyberpeers in Barking, London. Let’s build your next website or marketing campaign together.",
    url: "https://cyberpeers.co.uk/contact",
    siteName: "Cyberpeers",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact Cyberpeers London Digital Agency",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Cyberpeers | London Digital Agency",
    description:
      "Speak with our London-based team about web development, SEO, and performance marketing.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://cyberpeers.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
