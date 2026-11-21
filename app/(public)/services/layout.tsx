import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lash extensions and prices",
  description:
    "Classic, hybrid, Russian volume, wispy, anime and mega volume lash sets, infills and removal near Dartford Station, with prices and times.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
