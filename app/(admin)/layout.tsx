import type { Metadata } from "next";
import "./admin.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Studio admin", template: "%s | LashesByZee admin" },
  robots: { index: false, follow: false },
};

// The admin area (/office and /admin/*): Redux and the admin styles, scoped under .adm
export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <Providers>{children}</Providers>
    </div>
  );
}
