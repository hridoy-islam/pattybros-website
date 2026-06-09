"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Menu, 
  LogOut,
  ChevronRight,
  ChevronDown, 
  Package,
  Settings,
  Layers, // Imported for the Category submenu icon
  Crosshair,
  Table,
  Calendar,
  User
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Updated navItems: Submenu items now have an explicit "icon" property
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Reservations", href: "/admin/reservations", icon: Calendar },
    { label: "Menu", href: "/admin/menu", icon: Package },
    { 
      label: "Settings", 
      icon: Settings, 
      submenu: [
        { label: "Category", href: "/admin/settings/category", icon: Layers },
        { label: "Company Details", href: "/admin/settings/company-profile", icon: User }
      ]
    }
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const NavLinks = ({ onClickCallback }: { onClickCallback?: () => void }) => (
    <nav className="flex-1 px-3 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const hasSubmenu = !!item.submenu;

        const isParentActive = item.href 
          ? pathname === item.href 
          : item.submenu?.some((sub) => pathname === sub.href);

        const isSubmenuOpen = openSubmenus[item.label] || item.submenu?.some((sub) => pathname === sub.href);

        if (hasSubmenu) {
          return (
            <div key={item.label} className="space-y-1">
              <button
                onClick={() => toggleSubmenu(item.label)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isParentActive 
                    ? "bg-black/5 text-black" 
                    : "text-black hover:bg-black/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isParentActive ? "text-black" : "text-black/60 group-hover:text-black"
                  )} />
                  <span>{item.label}</span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-black/60 transition-transform duration-200",
                  isSubmenuOpen && "transform rotate-180"
                )} />
              </button>

              {isSubmenuOpen && (
                <div className="pl-4 pr-2 space-y-1 transition-all duration-200">
                  {item.submenu?.map((subItem) => {
                    const isChildActive = pathname === subItem.href;
                    const SubIcon = subItem.icon; // Extracting submenu icon
                    
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={onClickCallback}
                        className={cn(
                          "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                          isChildActive
                            ? "bg-primary-foreground text-white shadow-md shadow-black/10"
                            : "text-black/80 hover:text-black hover:bg-black/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {SubIcon && (
                            <SubIcon className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              isChildActive ? "text-white" : "text-black/40 group-hover:text-black"
                            )} />
                          )}
                          <span>{subItem.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Standard Top Level Link
        return (
          <Link
            key={item.href}
            href={item.href || "#"}
            onClick={onClickCallback}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
              isParentActive 
                ? "bg-primary-foreground text-white shadow-lg shadow-black/10" 
                : "text-black hover:bg-black/5"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isParentActive ? "text-white" : "text-black/60 group-hover:text-black"
              )} />
              <span>{item.label}</span>
            </div>
            {isParentActive && (
              <ChevronRight className="w-4 h-4 opacity-50" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 ">
        <Link href="/admin" className="block">
          <Image
            src="/logo.png"
            alt="Patty Bro's"
            width={140}
            height={35}
            className="object-contain transition-transform hover:scale-105"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <NavLinks />
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-black/10 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-black/10">
        <div className="flex items-center justify-between px-4 h-16">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-black hover:bg-black/5 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white p-0 ">
              <SheetTitle className="sr-only">
                Navigation Menu
              </SheetTitle>
              <div className="h-full relative">
                <div className="px-6 py-6 border-b border-black/10">
                  <Image
                    src="/logo.png"
                    alt="Patty Bro's"
                    width={130}
                    height={35}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="py-6">
                  <NavLinks onClickCallback={() => setOpen(false)} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 p-4">
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-white border-r border-black/10">
        <SidebarContent />
      </aside>
    </>
  );
}