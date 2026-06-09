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
  metadataBase: new URL("https://patty-bros.co.uk"),
  title: {
    default: "Patty Bro's | Smash Burger Restaurant in London",
    template: "%s | Patty Bro's",
  },
  description:
    "Patty Bros is a UK-based smash burger restaurant in London, serving fresh, high-quality burgers, loaded fries, and street food favourites with bold flavour and premium ingredients.",
  keywords: [
    "Patty Bros",
    "Smash Burger London",
    "Burger Restaurant UK",
    "Best Burgers Peckham",
    "London Street Food",
    "Fast Food Restaurant",
    "Chicken Burgers",
    "Loaded Fries",
    "Burger Delivery London",
    "Peckham Burger Shop",
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
    title: "Patty Bros | Smash Burger Restaurant in London",
    description:
      "Enjoy bold, juicy smash burgers and loaded fries at Patty Bros. A modern London burger restaurant serving fresh street food favourites.",
    url: "https://patty-bros.co.uk",
    siteName: "Patty Bros",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Patty Bros Smash Burger Restaurant",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patty Bros | Smash Burger Restaurant in London",
    description:
      "Fresh smash burgers, loaded fries, and street food favourites in London.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://patty-bros.co.uk",
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