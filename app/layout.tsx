import type { Metadata, Viewport } from "next";
import { EB_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const text = Jost({ subsets: ["latin"], variable: "--font-text" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "LashesByZee: luxury lash extensions in Dartford, Kent",
    template: "%s | LashesByZee",
  },
  description:
    "Classic, hybrid, Russian volume, wispy, anime and mega volume lash extensions, designed for your eye shape, near Dartford Station.",
  keywords: [
    "lash extensions Dartford",
    "eyelash extensions Kent",
    "Russian volume lashes Dartford",
    "hybrid lashes Dartford",
    "wispy lashes Kent",
    "LashesByZee",
    "Lashes by Zee London",
  ],
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    title: "LashesByZee: luxury lash extensions in Dartford, Kent",
    description: "Lash extensions designed for your eye shape, near Dartford Station. Book online.",
    images: [{ url: "/share.jpg", width: 1200, height: 630, alt: "Lash extensions being applied with fine tweezers" }],
  },
  twitter: { card: "summary_large_image", images: ["/share.jpg"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbf8f3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${text.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
