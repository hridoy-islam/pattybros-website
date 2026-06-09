"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function AdminRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth) || { user: null };

  useEffect(() => {
    // If user is an admin and they aren't already looking at an admin route, push them to /admin
    if (user?.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}