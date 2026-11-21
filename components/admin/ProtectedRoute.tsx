"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { now } from "@/lib/moment-setup";

// Admin pages only for a signed-in admin with a live token; anyone else goes to the sign-in page.
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const expired = !!user && now().isAfter(user.exp * 1000);
  const allowed = !!user && user.role === "admin" && !expired;

  useEffect(() => {
    if (expired) dispatch(logout());
    if (!allowed) router.replace("/office");
  }, [allowed, expired, dispatch, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
