"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { now } from "@/lib/moment-setup";

// A signed-in admin who opens the sign-in page is sent straight to the dashboard.
export default function AdminRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (user?.role === "admin" && now().isBefore(user.exp * 1000) && !pathname.startsWith("/admin")) {
      router.replace("/admin");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
