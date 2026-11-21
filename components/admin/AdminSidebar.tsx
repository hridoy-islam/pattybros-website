"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/settings/studio", label: "Studio settings" },
  { href: "/admin/settings/profile", label: "My profile" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const signOut = () => {
    dispatch(logout());
    router.replace("/office");
  };

  return (
    <>
      <div className="topbar">
        <span>LashesByZee admin</span>
        <button type="button" aria-expanded={open} aria-controls="admin-side" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <aside id="admin-side" className={`side ${open ? "is-open" : ""}`}>
        <Link className="side__brand" href="/admin" onClick={() => setOpen(false)}>
          <img src="/logo-256.png" alt="" />
          <span>LashesByZee</span>
        </Link>
        <nav className="side__nav" aria-label="Admin">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="side__link"
              aria-current={isCurrent(l.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="side__foot">
          <span className="side__user">Signed in as {user?.name}</span>
          <Link className="side__btn" href="/" onClick={() => setOpen(false)}>
            View the website
          </Link>
          <button className="side__btn" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
