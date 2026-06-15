import type { Metadata } from "next";
import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/utils";
import { Providers } from "@/app/providers"; // Cleanly handles Redux, PersistGate, etc.
import { Toaster } from "@/components/ui/toaster";
import AdminRedirectGuard from "@/components/shared/AdminRedirectGuard";

const fontHeading = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.patty-bros.co.uk"),

  title: {
    default: "Patty Bros Peckham | Smash Burgers, Loaded Fries & Street Food",
    template: "%s | Patty Bros",
  },

  description:
    "Patty Bros in Peckham serves proper smash burgers made with quality British aged beef, loaded fries, bold sauces and fresh comfort food in South East London.",

  keywords: [
    "Patty Bros Peckham",
    "Smash Burgers Peckham",
    "Smash Burger London",
    "Loaded Fries London",
    "Street Food Peckham",
    "Burger Shop South East London",
    "British Aged Beef Burgers",
    "Best Burgers Peckham",
    "Burger Delivery London",
    "Comfort Food London",
  ],

  authors: [{ name: "Patty Bros" }],
  creator: "Patty Bros",
  publisher: "Patty Bros",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Patty Bros Peckham | Smash Burgers, Loaded Fries & Street Food",
    description:
      "Patty Bros in Peckham serves proper smash burgers made with quality British aged beef, loaded fries, bold sauces and fresh comfort food in South East London.",
    url: "https://www.patty-bros.co.uk",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Smash Burgers Peckham",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Patty Bros Peckham | Smash Burgers, Loaded Fries & Street Food",
    description:
      "Proper smash burgers, loaded fries, bold sauces and fresh comfort food in South East London.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: "https://www.patty-bros.co.uk",
  },

  category: "food",
  applicationName: "Patty Bros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontHeading.variable,
          fontSans.variable
        )}
      >
        {/* Pass downstream routes into your client side component wrapper */}
        <Providers>
         <AdminRedirectGuard>
            <main className="flex-1">{children}</main>
          </AdminRedirectGuard>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}